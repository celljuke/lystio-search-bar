"use client";

import { useEffect, useRef } from "react";
import mapboxgl from "mapbox-gl";

interface PropertyMarkerProps {
  id: number;
  location: [number, number];
  price: number;
  isSelected: boolean;
  onClick: () => void;
  map: mapboxgl.Map;
}

export function PropertyMarker({
  id,
  location,
  price,
  isSelected,
  onClick,
  map,
}: PropertyMarkerProps) {
  const markerRef = useRef<mapboxgl.Marker | null>(null);

  useEffect(() => {
    if (!map) return;

    // Create marker element
    const el = document.createElement("button");
    el.className = "custom-marker";
    el.setAttribute("data-marker-id", id.toString());

    // Set text content first
    el.textContent = `€${price}`;

    // Update styles based on selection state
    const updateStyles = (selected: boolean) => {
      el.style.cssText = `
        background-color: ${selected ? "#A540F3" : "white"};
        color: ${selected ? "white" : "black"};
        padding: 6px 12px;
        border-radius: 20px;
        font-weight: 600;
        font-size: 14px;
        cursor: pointer;
        border: ${selected ? "2px solid #A540F3" : "1px solid #ddd"};
        box-shadow: 0 2px 8px rgba(0,0,0,0.15);
        white-space: nowrap;
        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
        user-select: none;
        display: inline-block;
      `;
    };

    updateStyles(isSelected);

    // Set initial selected state
    el.setAttribute("data-selected", isSelected.toString());

    // Hover effects - don't use transform to prevent jumping
    const handleMouseEnter = () => {
      const selected = el.getAttribute("data-selected") === "true";
      if (!selected) {
        el.style.backgroundColor = "#f7f7f7";
        el.style.boxShadow = "0 4px 12px rgba(0,0,0,0.2)";
      }
    };

    const handleMouseLeave = () => {
      const selected = el.getAttribute("data-selected") === "true";
      if (!selected) {
        el.style.backgroundColor = "white";
        el.style.boxShadow = "0 2px 8px rgba(0,0,0,0.15)";
      }
    };

    el.addEventListener("mouseenter", handleMouseEnter);
    el.addEventListener("mouseleave", handleMouseLeave);

    // Click handler
    const handleClick = (e: MouseEvent) => {
      e.stopPropagation();
      onClick();
    };
    el.addEventListener("click", handleClick);

    // Create marker without anchor to prevent jumping
    const marker = new mapboxgl.Marker({
      element: el,
      // Don't set anchor - let it default to bottom
    })
      .setLngLat(location)
      .addTo(map);

    markerRef.current = marker;

    // Cleanup
    return () => {
      if (markerRef.current) {
        markerRef.current.remove();
        markerRef.current = null;
      }
    };
  }, [id, location, price, map]);

  // Update marker appearance when selection changes
  useEffect(() => {
    if (!markerRef.current) return;

    const el = markerRef.current.getElement();

    // Update data attribute so hover knows about selection state
    el.setAttribute("data-selected", isSelected.toString());

    // Update styles
    el.style.backgroundColor = isSelected ? "#A540F3" : "white";
    el.style.color = isSelected ? "white" : "black";
    el.style.border = isSelected ? "2px solid #A540F3" : "1px solid #ddd";
  }, [isSelected]);

  return null; // This component only creates map markers
}
