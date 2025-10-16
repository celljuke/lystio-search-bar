"use client";

import Image from "next/image";
import { ChevronRight } from "lucide-react";

interface MobileLocationContentProps {
  onSelectLocation: (location: string) => void;
}

interface City {
  name: string;
  districts: number;
  image: string;
}

interface State {
  name: string;
  districts: number;
  image: string;
}

const CITIES: City[] = [
  { name: "Vienna", districts: 23, image: "/images/cities/vienna.png" },
  { name: "Graz", districts: 23, image: "/images/cities/graz.png" },
  { name: "Linz", districts: 23, image: "/images/cities/linz.png" },
  { name: "Salzburg", districts: 23, image: "/images/cities/salzburg.png" },
  { name: "Innsbruck", districts: 23, image: "/images/cities/innsbruck.png" },
  { name: "Klagenfurt", districts: 23, image: "/images/cities/klagenfurt.png" },
];

const STATES: State[] = [
  { name: "Lower Austria", districts: 24, image: "/images/cities/vienna.png" },
  {
    name: "Upper Austria",
    districts: 18,
    image: "/images/cities/salzburg.png",
  },
  { name: "Burgenland", districts: 9, image: "/images/cities/vienna.png" },
  { name: "Carinthia", districts: 10, image: "/images/cities/klagenfurt.png" },
  { name: "Vorarlberg", districts: 4, image: "/images/cities/innsbruck.png" },
];

export function MobileLocationContent({
  onSelectLocation,
}: MobileLocationContentProps) {
  return (
    <div className="space-y-6 pb-6">
      {/* Search by City */}
      <div>
        <h4 className="text-sm font-medium text-gray-500 mb-3">
          Search by City
        </h4>
        <div className="grid grid-cols-3 gap-3">
          {CITIES.map((city) => (
            <button
              key={city.name}
              onClick={() => onSelectLocation(city.name)}
              className="group flex flex-col items-start hover:opacity-80 transition-opacity"
            >
              {/* City Image */}
              <div className="relative w-full aspect-square overflow-hidden rounded-xl mb-2">
                <Image
                  src={city.image}
                  alt={city.name}
                  fill
                  className="object-cover"
                />
              </div>

              {/* City Info */}
              <div className="text-left w-full">
                <h5 className="text-sm font-semibold text-gray-900">
                  {city.name}
                </h5>
                <p className="text-xs text-gray-500">
                  {city.districts} Districts
                </p>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Search by State */}
      <div>
        <h4 className="text-sm font-medium text-gray-500 mb-3">
          Search by State
        </h4>
        <div className="space-y-2">
          {STATES.map((state) => (
            <button
              key={state.name}
              onClick={() => onSelectLocation(state.name)}
              className="flex items-center gap-3 w-full p-3 rounded-xl hover:bg-gray-50 transition-colors group"
            >
              {/* State Image */}
              <div className="relative w-12 h-12 rounded-lg overflow-hidden flex-shrink-0">
                <Image
                  src={state.image}
                  alt={state.name}
                  fill
                  className="object-cover"
                />
              </div>

              {/* State Info */}
              <div className="flex-1 text-left">
                <h5 className="text-base font-medium text-gray-900">
                  {state.name}
                </h5>
                <p className="text-sm text-gray-500">
                  {state.districts} Districts
                </p>
              </div>

              <ChevronRight className="w-5 h-5 text-gray-400 group-hover:text-gray-900 transition-colors" />
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
