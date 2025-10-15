"use client";

import { Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface SearchButtonProps {
  onClick: () => void;
  isSearchMode: boolean;
  className?: string;
}

export function SearchButton({
  onClick,
  isSearchMode,
  className = "",
}: SearchButtonProps) {
  return (
    <div className={cn("absolute right-2 top-1/2 -translate-y-1/2", className)}>
      {!isSearchMode ? (
        // Normal state - Icon only
        <Button
          onClick={onClick}
          className="h-12 w-12 rounded-full bg-[#A540F3] hover:bg-[#9338D1] shadow-md"
        >
          <Search className="w-5 h-5 text-white" />
        </Button>
      ) : (
        // Search mode - Text with icon
        <Button
          onClick={onClick}
          className="h-12 px-8 rounded-full bg-[#A540F3] hover:bg-[#9338D1] shadow-md text-white font-medium"
        >
          <Search className="w-5 h-5 mr-2" />
          Search
        </Button>
      )}
    </div>
  );
}
