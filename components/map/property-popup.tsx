"use client";

import { useEffect, useRef } from "react";
import mapboxgl from "mapbox-gl";

interface Property {
  id: number;
  location: [number, number];
  rent: number;
  rentPer?: [number | null, number | null];
  title?: string;
  address?: string;
  city?: string;
  size?: number | null;
  rooms?: number | null;
  media?: Array<{ type: string; cdnUrl: string }>;
}

interface PropertyPopupProps {
  property: Property | null;
  map: mapboxgl.Map;
  onClose: () => void;
}

export function PropertyPopup({ property, map, onClose }: PropertyPopupProps) {
  const popupRef = useRef<mapboxgl.Popup | null>(null);

  useEffect(() => {
    if (!map || !property) {
      // Close popup when no property selected
      if (popupRef.current) {
        popupRef.current.remove();
        popupRef.current = null;
      }
      return;
    }

    // Remove existing popup
    if (popupRef.current) {
      popupRef.current.remove();
    }

    // Format price per sqm
    const pricePerSqm = property.rentPer?.[0] || property.rentPer?.[1];

    // Get first photo from media array
    const firstPhoto = property.media?.find((m) => m.type === "photo");
    const imageUrl = firstPhoto?.cdnUrl || null;

    // Create popup HTML
    const popupHTML = `
      <div style="min-width: 280px; max-width: 320px;">
        ${
          imageUrl
            ? `
          <div style="position: relative; width: 100%; height: 200px; border-radius: 12px 12px 0 0; overflow: hidden; background: #f0f0f0;">
            <img 
              src="${imageUrl}" 
              alt="Property" 
              style="width: 100%; height: 100%; object-fit: cover; display: block;"
              onerror="this.style.display='none'"
            />
            <button 
              onclick="window.closeMapPopup()" 
              style="position: absolute; top: 8px; right: 8px; background: white; border: none; border-radius: 50%; width: 32px; height: 32px; display: flex; align-items: center; justify-content: center; cursor: pointer; box-shadow: 0 2px 4px rgba(0,0,0,0.1); z-index: 10;"
            >
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 4L4 12M4 4L12 12" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
              </svg>
            </button>
          </div>
        `
            : `
          <div style="display: flex; justify-content: flex-end; margin-bottom: 8px;">
            <button 
              onclick="window.closeMapPopup()" 
              style="background: #f7f7f7; border: none; border-radius: 50%; width: 32px; height: 32px; display: flex; align-items: center; justify-content: center; cursor: pointer;"
            >
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 4L4 12M4 4L12 12" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
              </svg>
            </button>
          </div>
        `
        }
        <div style="padding: ${imageUrl ? "10px 0 10px 0" : "0"};">
          <div style="font-size: 20px; font-weight: 700; margin-bottom: 4px;">
            €${property.rent}
            <span style="font-size: 14px; font-weight: 400; color: #666;">/month</span>
          </div>
          ${
            pricePerSqm
              ? `<div style="font-size: 14px; color: #666; margin-bottom: 8px;">€${pricePerSqm}/m²</div>`
              : ""
          }
          ${
            property.title
              ? `<div style="font-size: 14px; font-weight: 500; margin-bottom: 4px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;">${property.title}</div>`
              : ""
          }
          ${
            property.address || property.city
              ? `<div style="font-size: 13px; color: #666; margin-bottom: 8px;">📍 ${[
                  property.address,
                  property.city,
                ]
                  .filter(Boolean)
                  .join(", ")}</div>`
              : ""
          }
          ${
            property.size || property.rooms
              ? `
            <div style="display: flex; gap: 12px; font-size: 13px; color: #666;">
              ${property.size ? `<span>🏠 ${property.size}m²</span>` : ""}
              ${
                property.rooms
                  ? `<span>🛏️ ${property.rooms} Room${
                      property.rooms > 1 ? "s" : ""
                    }</span>`
                  : ""
              }
            </div>
          `
              : ""
          }
        </div>
      </div>
    `;

    // Create popup
    const popup = new mapboxgl.Popup({
      closeButton: false,
      closeOnClick: false,
      offset: 25,
      maxWidth: "none",
      className: "property-popup",
    })
      .setLngLat(property.location)
      .setHTML(popupHTML)
      .addTo(map);

    popupRef.current = popup;

    // Add global close function
    (window as any).closeMapPopup = onClose;

    // Cleanup
    return () => {
      if (popupRef.current) {
        popupRef.current.remove();
        popupRef.current = null;
      }
      delete (window as any).closeMapPopup;
    };
  }, [property, map, onClose]);

  return null; // This component only creates map popups
}
