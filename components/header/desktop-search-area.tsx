"use client";

import { SearchBar, RentBuyToggle } from "@/modules/search";
import { cn } from "@/lib/utils";

interface DesktopSearchAreaProps {
  rentBuyValue: "rent" | "buy" | "ai";
  onRentBuyChange: (value: "rent" | "buy" | "ai") => void;
  isPopoverOpen: boolean;
  isInSearchMode: boolean;
}

export function DesktopSearchArea({
  rentBuyValue,
  onRentBuyChange,
  isPopoverOpen,
  isInSearchMode,
}: DesktopSearchAreaProps) {
  return (
    <div
      className={cn(
        "flex flex-1 mx-8 flex-col items-center transition-all duration-200",
        isPopoverOpen ? "gap-3 justify-center" : "justify-center",
        isInSearchMode ? "max-w-4xl" : "max-w-lg"
      )}
    >
      {/* Rent/Buy Toggle - Only visible in search mode */}
      {isPopoverOpen && (
        <div className="w-full flex justify-center">
          <RentBuyToggle value={rentBuyValue} onChange={onRentBuyChange} />
        </div>
      )}

      {/* Search Bar */}
      <div className="w-full">
        <SearchBar rentBuyMode={rentBuyValue} />
      </div>
    </div>
  );
}
