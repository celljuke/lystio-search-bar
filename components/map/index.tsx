"use client";

import { useEffect, useRef } from "react";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";

interface MapProps {
  accessToken: string;
  initialCenter?: [number, number];
  initialZoom?: number;
  className?: string;
}

export function Map({
  accessToken,
  initialCenter = [16.3738, 48.2082], // Vienna, Austria
  initialZoom = 11,
  className = "",
}: MapProps) {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);

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
  }, [accessToken, initialCenter, initialZoom]);

  return (
    <div className={className}>
      <div ref={mapContainer} className="w-full h-full" />
    </div>
  );
}
