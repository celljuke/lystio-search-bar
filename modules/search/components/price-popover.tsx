"use client";

import { DollarSign } from "lucide-react";
import { Button } from "../../../components/ui/button";

interface PricePopoverProps {
  onSelectPrice: (priceRange: string) => void;
}

const PRICE_RANGES = [
  "Under €500",
  "€500 - €1000",
  "€1000 - €1500",
  "€1500 - €2000",
  "€2000 - €3000",
  "Over €3000",
];

export function PricePopover({ onSelectPrice }: PricePopoverProps) {
  return (
    <div className="absolute top-full left-0 mt-2 w-80 bg-white border border-gray-200 rounded-lg shadow-lg z-[100] p-4">
      <div className="space-y-4">
        <div>
          <h4 className="font-medium mb-2">Price Range</h4>
          <div className="grid grid-cols-2 gap-2">
            {PRICE_RANGES.map((range) => (
              <Button
                key={range}
                variant="ghost"
                className="justify-start"
                onClick={() => onSelectPrice(range)}
              >
                <DollarSign className="w-4 h-4 mr-2" />
                {range}
              </Button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
