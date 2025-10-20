"use client";

import { useEffect, useRef, useState } from "react";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";

interface MapProps {
  accessToken: string;
  initialCenter?: [number, number];
  initialZoom?: number;
  className?: string;
  bbox?: [[number, number], [number, number]]; // [[minLng, minLat], [maxLng, maxLat]]
}

export function Map({
  accessToken,
  initialCenter = [16.3738, 48.2082], // Vienna, Austria
  initialZoom = 11,
  className = "",
  bbox,
}: MapProps) {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const [mapLoaded, setMapLoaded] = useState(false);

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

  return (
    <div className={className}>
      <div ref={mapContainer} className="w-full h-full" />
    </div>
  );
}
