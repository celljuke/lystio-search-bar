"use client";

import Image from "next/image";
import { Check } from "lucide-react";
import { motion } from "motion/react";
import { cn } from "@/lib/utils";

interface City {
  name: string;
  districts: number;
  image: string;
  id: string;
  children: Array<{
    name: string;
    id: string;
    postal_code: string;
  }>;
}

interface DesktopCityGridProps {
  cities: City[];
  selectedLocationName?: string;
  selectedCity: City | null;
  isLoading: boolean;
  onCityClick: (city: City) => void;
}

export function DesktopCityGrid({
  cities,
  selectedLocationName,
  selectedCity,
  isLoading,
  onCityClick,
}: DesktopCityGridProps) {
  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="text-sm text-gray-500">Loading cities...</div>
      </div>
    );
  }

  return (
    <div
      className={cn("grid gap-3", selectedCity ? "grid-cols-2" : "grid-cols-3")}
    >
      {cities.map((city, index) => {
        const isSelected = selectedLocationName === city.name;
        return (
          <motion.button
            key={city.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              delay: index * 0.05,
              duration: 0.3,
              ease: [0.4, 0, 0.2, 1],
            }}
            onClick={() => onCityClick(city)}
            disabled={isLoading}
            className={cn(
              "group flex flex-col items-start transition-all disabled:opacity-50 disabled:cursor-not-allowed rounded-md",
              isSelected ? "ring-1 ring-[#A540F3] p-0.5" : "hover:opacity-80"
            )}
          >
            {/* City Image */}
            <div className="relative w-full aspect-square overflow-hidden mb-2 rounded-md">
              <Image
                src={city.image}
                alt={city.name}
                fill
                className="object-cover"
              />

              {/* Checkmark for selected city */}
              {isSelected && (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ duration: 0.2 }}
                  className="absolute top-1 right-1 w-5 h-5 bg-primary rounded-full flex items-center justify-center shadow-lg border-1 border-white"
                >
                  <Check className="w-3 h-3 text-white" />
                </motion.div>
              )}
            </div>

            {/* City Info */}
            <div className={cn("text-left w-full", isSelected && "px-2 pb-2")}>
              <h5
                className={cn(
                  "text-sm font-semibold",
                  isSelected ? "text-[#A540F3]" : "text-gray-900"
                )}
              >
                {city.name}
              </h5>
              <p
                className={cn(
                  "text-xs",
                  isSelected ? "text-[#A540F3]" : "text-gray-500"
                )}
              >
                {city.districts === 0
                  ? "All Districts"
                  : `${city.districts} Districts`}
              </p>
            </div>
          </motion.button>
        );
      })}
    </div>
  );
}
