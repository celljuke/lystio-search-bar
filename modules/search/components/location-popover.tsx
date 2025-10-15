"use client";

import { MapPin } from "lucide-react";
import { Button } from "../../../components/ui/button";

interface LocationPopoverProps {
  onSelectLocation: (location: string) => void;
}

const CITIES = [
  "Vienna",
  "Graz",
  "Linz",
  "Salzburg",
  "Innsbruck",
  "Klagenfurt",
];

const STATES = ["Lower Austria", "Upper Austria"];

export function LocationPopover({ onSelectLocation }: LocationPopoverProps) {
  return (
    <div className="absolute top-full left-0 mt-2 w-80 bg-white border border-gray-200 rounded-lg shadow-lg z-[100] p-4">
      <div className="space-y-4">
        <Button variant="ghost" className="w-full justify-start">
          <MapPin className="w-4 h-4 mr-2" />
          Draw an area on the map
        </Button>

        <div>
          <h4 className="font-medium mb-2">By City</h4>
          <div className="grid grid-cols-2 gap-2">
            {CITIES.map((city) => (
              <Button
                key={city}
                variant="ghost"
                className="h-auto p-3 justify-start"
                onClick={() => onSelectLocation(city)}
              >
                <div className="flex flex-col items-start">
                  <span className="text-sm font-medium">{city}</span>
                  <span className="text-xs text-gray-500">23 Districts</span>
                </div>
              </Button>
            ))}
          </div>
        </div>

        <div>
          <h4 className="font-medium mb-2">By State</h4>
          <div className="space-y-2">
            {STATES.map((state) => (
              <Button
                key={state}
                variant="ghost"
                className="w-full justify-between"
                onClick={() => onSelectLocation(state)}
              >
                <div className="flex flex-col items-start">
                  <span className="text-sm font-medium">{state}</span>
                  <span className="text-xs text-gray-500">24 Districts</span>
                </div>
              </Button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
