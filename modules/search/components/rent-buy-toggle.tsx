"use client";

import { Toggle } from "../../../components/ui/toggle";
import { cn } from "../../../lib/utils";

interface RentBuyToggleProps {
  value: "rent" | "buy";
  onChange: (value: "rent" | "buy") => void;
  className?: string;
}

export function RentBuyToggle({
  value,
  onChange,
  className,
}: RentBuyToggleProps) {
  return (
    <div className={cn("flex items-center", className)}>
      <div className="relative flex h-11 w-44 items-center rounded-full border border-[#E5E3F8] bg-gray-50 p-1">
        {/* Sliding background */}
        <div
          className={cn(
            "absolute rounded-full border border-white bg-white shadow-lg transition-all duration-200",
            value === "rent" ? "left-1" : "left-[calc(100%-83px-4px)]"
          )}
          style={{ width: "83px", height: "calc(100% - 8px)" }}
        />

        {/* Rent Button */}
        <Toggle
          pressed={value === "rent"}
          onPressedChange={() => onChange("rent")}
          className="relative z-10 flex h-full flex-1 items-center justify-center rounded-full px-2 transition-colors"
          aria-pressed={value === "rent"}
        >
          <span className="text-base font-normal text-black">Rent</span>
        </Toggle>

        {/* Buy Button */}
        <Toggle
          pressed={value === "buy"}
          onPressedChange={() => onChange("buy")}
          className="relative z-10 flex h-full flex-1 items-center justify-center rounded-full px-2 transition-colors"
          aria-pressed={value === "buy"}
        >
          <span className="text-base font-normal text-black">Buy</span>
        </Toggle>
      </div>
    </div>
  );
}
