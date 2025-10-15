"use client";

import Image from "next/image";
import { ArrowRight, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface LocationPopoverProps {
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
];

export function LocationPopover({ onSelectLocation }: LocationPopoverProps) {
  return (
    <div className="absolute top-full left-0 mt-2 w-[300px] bg-white border border-gray-200 rounded-2xl shadow-xl z-[100] overflow-hidden">
      <div className="max-h-[500px] overflow-y-auto p-3">
        <div className="space-y-6">
          {/* Draw an area on the map */}
          <button
            className="flex items-center gap-3 w-full p-2 rounded-xl hover:bg-gray-50 transition-colors group border border-[#EEE7FF] shadow-lg"
            onClick={() => {}}
          >
            <div className="w-8 h-8 rounded-full bg-purple-50 flex items-center justify-center">
              <Image
                src="/icons/draw.svg"
                alt="Map"
                width={24}
                height={24}
                className="w-6 h-6"
              />
            </div>
            <span className="text-sm font-medium text-gray-900 flex-1 text-left">
              Draw an area on the map
            </span>
            <ArrowRight className="w-5 h-5 text-[#A540F3]" />
          </button>

          {/* By City */}
          <div>
            <h4 className="text-base font-semibold text-gray-900 mb-4">
              By City
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

          {/* By State */}
          <div>
            <h4 className="text-base font-semibold text-gray-900 mb-4">
              By State
            </h4>
            <div className="space-y-2">
              {STATES.map((state) => (
                <button
                  key={state.name}
                  onClick={() => onSelectLocation(state.name)}
                  className="flex items-center gap-3 w-full p-2 rounded-xl hover:bg-gray-50 transition-colors group"
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
                    <h5 className="text-base font-semibold text-gray-900">
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
      </div>
    </div>
  );
}
