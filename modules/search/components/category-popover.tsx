"use client";

import { Home } from "lucide-react";
import { Button } from "../../../components/ui/button";

interface CategoryPopoverProps {
  onSelectCategory: (category: string) => void;
}

const PROPERTY_TYPES = ["Apartments", "Houses", "Commercial", "Land"];

export function CategoryPopover({ onSelectCategory }: CategoryPopoverProps) {
  return (
    <div className="absolute top-full left-0 mt-2 w-64 bg-white border border-gray-200 rounded-lg shadow-lg z-[100] p-4">
      <div className="space-y-2">
        {PROPERTY_TYPES.map((type) => (
          <Button
            key={type}
            variant="ghost"
            className="w-full justify-start"
            onClick={() => onSelectCategory(type)}
          >
            <Home className="w-4 h-4 mr-2" />
            {type}
          </Button>
        ))}
      </div>
    </div>
  );
}
