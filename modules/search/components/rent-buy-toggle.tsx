"use client";

import { cn } from "@/lib/utils";

interface RentBuyToggleProps {
  value: "rent" | "buy" | "ai";
  onChange: (value: "rent" | "buy" | "ai") => void;
  className?: string;
}

export function RentBuyToggle({
  value,
  onChange,
  className,
}: RentBuyToggleProps) {
  const getSliderTransform = () => {
    switch (value) {
      case "rent":
        return "translateX(0)";
      case "buy":
        return "translateX(100%)";
      case "ai":
        return "translateX(200%)";
      default:
        return "translateX(0)";
    }
  };

  return (
    <div className={cn("flex items-center justify-center", className)}>
      <div className="relative inline-flex h-12 items-center rounded-full border border-[#EEE7FF] bg-[#F7F7FD] p-1">
        {/* Sliding background - uses grid for equal spacing */}
        <div className="absolute inset-1 grid grid-cols-3 gap-0">
          <div
            className="rounded-full bg-white shadow-md transition-transform duration-300 ease-out"
            style={{ transform: getSliderTransform() }}
          />
        </div>

        {/* Buttons container - also uses grid for equal spacing */}
        <div className="relative z-10 grid grid-cols-3 gap-0">
          {/* Rent Button */}
          <button
            onClick={() => onChange("rent")}
            className={cn(
              "flex h-10 items-center justify-center rounded-full px-3 transition-colors",
              value === "rent"
                ? "text-black font-medium"
                : "text-gray-600 font-medium"
            )}
          >
            <span className="text-base whitespace-nowrap">Rent</span>
          </button>

          {/* Buy Button */}
          <button
            onClick={() => onChange("buy")}
            className={cn(
              "flex h-10 items-center justify-center rounded-full px-3 transition-colors",
              value === "buy"
                ? "text-black font-medium"
                : "text-gray-600 font-medium"
            )}
          >
            <span className="text-base whitespace-nowrap">Buy</span>
          </button>

          {/* Lystio AI Button */}
          <button
            onClick={() => onChange("ai")}
            className={cn(
              "flex h-10 items-center justify-center rounded-full px-3 transition-colors",
              value === "ai"
                ? "text-black font-medium"
                : "text-gray-600 font-medium"
            )}
          >
            <span className="text-base whitespace-nowrap">
              Lystio <span className="text-[#A540F3]">AI</span>
            </span>
          </button>
        </div>
      </div>
    </div>
  );
}
