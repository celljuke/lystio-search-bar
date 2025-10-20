"use client";

import { Slider } from "@/components/ui/slider";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { usePrice } from "../hooks/use-price";
import { PriceRangeFilter } from "../types";
import { motion } from "motion/react";

interface PricePopoverProps {
  rentBuyMode: "rent" | "buy" | "ai";
  onSelectPrice: (priceRange: PriceRangeFilter) => void;
}

export function PricePopover({
  rentBuyMode,
  onSelectPrice,
}: PricePopoverProps) {
  const {
    priceRange,
    priceBounds,
    histogramData,
    handlePriceChange,
    handleApply,
    formatPrice,
  } = usePrice({ rentBuyMode, onSelectPrice });

  // Calculate which histogram bars are within the selected range
  const isBarInRange = (price: number) => {
    return price >= priceRange[0] && price <= priceRange[1];
  };

  // Calculate max count for histogram normalization
  const maxCount = Math.max(...histogramData.map((b) => b.count), 1);

  return (
    <motion.div
      initial={{ opacity: 0, y: -10, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -10, scale: 0.95 }}
      transition={{
        duration: 0.2,
        ease: [0.4, 0, 0.2, 1],
      }}
      className="absolute top-full left-0 mt-2 w-[400px] bg-white border border-gray-200 rounded-2xl shadow-xl z-[100] p-6"
    >
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h3 className="text-base font-semibold text-gray-900 mb-1">
            Price Range
          </h3>
          <p className="text-sm text-gray-500">
            {rentBuyMode === "rent" || rentBuyMode === "ai"
              ? "Monthly rent"
              : "Purchase price"}
          </p>
        </div>

        {/* Selected Price Range Display */}
        <div className="flex items-center justify-between">
          <div className="flex-1">
            <label className="text-xs font-medium text-gray-500 uppercase tracking-wider">
              Min Price
            </label>
            <div className="text-2xl font-semibold text-gray-900 mt-1">
              {formatPrice(priceRange[0])}
            </div>
          </div>
          <div className="mx-4 text-gray-400">—</div>
          <div className="flex-1 text-right">
            <label className="text-xs font-medium text-gray-500 uppercase tracking-wider">
              Max Price
            </label>
            <div className="text-2xl font-semibold text-gray-900 mt-1">
              {formatPrice(priceRange[1])}
            </div>
          </div>
        </div>

        {/* Histogram */}
        <div className="relative h-24 px-2">
          <div className="absolute inset-0 flex items-end justify-between gap-0.5">
            {histogramData.map((bar, index) => {
              const isInRange = isBarInRange(bar.price);
              const heightPercentage = (bar.count / maxCount) * 100;

              return (
                <div
                  key={index}
                  className={cn(
                    "flex-1 rounded-t transition-colors duration-200",
                    isInRange ? "bg-[#A540F3]" : "bg-gray-200"
                  )}
                  style={{
                    height: `${heightPercentage}%`,
                    minHeight: bar.count > 0 ? "4px" : "0px",
                  }}
                />
              );
            })}
          </div>
        </div>

        {/* Slider */}
        <div className="px-2">
          <Slider
            value={priceRange}
            onValueChange={handlePriceChange}
            min={priceBounds.min}
            max={priceBounds.max}
            step={priceBounds.step}
            className="w-full"
          />
        </div>

        {/* Price Labels */}
        <div className="flex items-center justify-between text-xs text-gray-500 px-2">
          <span>{formatPrice(priceBounds.min)}</span>
          <span>{formatPrice(priceBounds.max)}</span>
        </div>

        {/* Apply Button */}
        <Button
          onClick={handleApply}
          className="w-full bg-[#A540F3] hover:bg-[#8e35d1] text-white font-medium py-2.5"
        >
          Apply Price Range
        </Button>
      </div>
    </motion.div>
  );
}
