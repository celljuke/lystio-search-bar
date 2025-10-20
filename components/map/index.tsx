"use client";

import { useEffect, useRef, useState } from "react";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import { PropertyMarker } from "./property-marker";
import { PropertyPopup } from "./property-popup";

export interface Property {
  id: number;
  location: [number, number]; // [lng, lat]
  rent: number;
  rentPer?: [number | null, number | null];
  title?: string;
  address?: string;
  city?: string;
  size?: number | null;
  rooms?: number | null;
  media?: Array<{ type: string; cdnUrl: string }>;
}

interface MapProps {
  accessToken: string;
  initialCenter?: [number, number];
  initialZoom?: number;
  className?: string;
  bbox?: [[number, number], [number, number]]; // [[minLng, minLat], [maxLng, maxLat]]
  properties?: Property[];
  onPropertyClick?: (property: Property) => void;
}

export function Map({
  accessToken,
  initialCenter = [16.3738, 48.2082], // Vienna, Austria
  initialZoom = 11,
  className = "",
  bbox,
  properties = [],
  onPropertyClick,
}: MapProps) {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const [mapLoaded, setMapLoaded] = useState(false);
  const [selectedProperty, setSelectedProperty] = useState<Property | null>(
    null
  );

  // Initialize map only once
  useEffect(() => {
    if (!mapContainer.current || map.current) return;

    // Set Mapbox access token
    mapboxgl.accessToken = accessToken;

    // Initialize map
    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: "mapbox://styles/mapbox/streets-v12",
      center: initialCenter,
      zoom: initialZoom,
    });

    // Wait for map to load
    map.current.on("load", () => {
      setMapLoaded(true);
    });

    // Add navigation controls
    map.current.addControl(new mapboxgl.NavigationControl(), "top-right");

    // Add fullscreen control
    map.current.addControl(new mapboxgl.FullscreenControl(), "top-right");

    // Add geolocate control
    map.current.addControl(
      new mapboxgl.GeolocateControl({
        positionOptions: {
          enableHighAccuracy: true,
        },
        trackUserLocation: true,
        showUserHeading: true,
      }),
      "top-right"
    );

    // Cleanup on unmount
    return () => {
      if (map.current) {
        map.current.remove();
        map.current = null;
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Only run once on mount

  // Update map bounds when bbox changes
  useEffect(() => {
    if (!map.current || !mapLoaded || !bbox) return;

    console.log("Fitting bounds to:", bbox);

    // Convert bbox to LngLatBoundsLike format for Mapbox
    const bounds: mapboxgl.LngLatBoundsLike = [
      [bbox[0][0], bbox[0][1]], // Southwest corner [lng, lat]
      [bbox[1][0], bbox[1][1]], // Northeast corner [lng, lat]
    ];

    // Animate to the new bounds
    map.current.fitBounds(bounds, {
      padding: { top: 50, bottom: 50, left: 50, right: 50 },
      duration: 1000, // 1 second animation
      maxZoom: 13, // Don't zoom in too much
    });
  }, [bbox, mapLoaded]);

  // Close popup when clicking on map
  useEffect(() => {
    if (!map.current || !mapLoaded) return;

    const mapInstance = map.current;

    const handleMapClick = () => {
      setSelectedProperty(null);
    };

    mapInstance.on("click", handleMapClick);

    return () => {
      mapInstance.off("click", handleMapClick);
    };
  }, [mapLoaded]);

  // Handle property marker click
  const handlePropertyClick = (property: Property) => {
    setSelectedProperty(property);
    if (onPropertyClick) {
      onPropertyClick(property);
    }
  };

  // Handle popup close
  const handlePopupClose = () => {
    setSelectedProperty(null);
  };

  return (
    <div className={className}>
      <div ref={mapContainer} className="w-full h-full" />

      {/* Render property markers */}
      {mapLoaded &&
        map.current &&
        properties.map((property) => (
          <PropertyMarker
            key={property.id}
            id={property.id}
            location={property.location}
            price={property.rent}
            isSelected={selectedProperty?.id === property.id}
            onClick={() => handlePropertyClick(property)}
            map={map.current!}
          />
        ))}

      {/* Render property popup */}
      {mapLoaded && map.current && (
        <PropertyPopup
          property={selectedProperty}
          map={map.current}
          onClose={handlePopupClose}
        />
      )}

      {/* Global popup styles */}
      <style jsx global>{`
        .mapboxgl-popup-content {
          padding: 12px !important;
          border-radius: 12px !important;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15) !important;
        }
        .mapboxgl-popup-tip {
          border-top-color: white !important;
        }
      `}</style>
    </div>
  );
}
