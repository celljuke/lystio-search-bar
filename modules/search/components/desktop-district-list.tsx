"use client";

import { ChevronLeft } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";

interface District {
  name: string;
  id: string;
  postal_code: string;
}

interface City {
  name: string;
  districts: number;
  children: District[];
}

interface DesktopDistrictListProps {
  city: City;
  selectedDistrictIds: string[];
  onBack: () => void;
  onDistrictToggle: (districtId: string) => void;
  onSelectAll: () => void;
}

export function DesktopDistrictList({
  city,
  selectedDistrictIds,
  onBack,
  onDistrictToggle,
  onSelectAll,
}: DesktopDistrictListProps) {
  const isAllSelected = selectedDistrictIds.length === city.children.length;

  return (
    <div className="flex-1 border-l border-gray-200 pl-4">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex-1">
          <h4 className="text-base font-semibold text-gray-900">{city.name}</h4>
          <p className="text-xs text-gray-500">Select districts</p>
        </div>
        <button
          onClick={onBack}
          className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <ChevronLeft className="w-4 h-4 text-gray-600" />
        </button>
      </div>

      {/* All Districts checkbox */}
      <div className="mb-3 pb-3 border-b border-gray-200">
        <label className="flex items-center gap-3 p-2 hover:bg-gray-50 rounded-lg cursor-pointer">
          <Checkbox checked={isAllSelected} onCheckedChange={onSelectAll} />
          <div className="flex-1">
            <p className="text-sm font-medium text-gray-900">All Districts</p>
            <p className="text-xs text-gray-500">{city.districts} Districts</p>
          </div>
        </label>
      </div>

      {/* District checkboxes */}
      <div className="space-y-1 max-h-[300px] overflow-y-auto">
        {city.children.map((district) => (
          <label
            key={district.id}
            className="flex items-center gap-3 p-2 hover:bg-gray-50 rounded-lg cursor-pointer"
          >
            <Checkbox
              checked={selectedDistrictIds.includes(district.id)}
              onCheckedChange={() => onDistrictToggle(district.id)}
            />
            <div className="flex-1">
              <p className="text-sm text-gray-900">{district.name}</p>
              {district.postal_code && (
                <p className="text-xs text-gray-500">{district.postal_code}</p>
              )}
            </div>
          </label>
        ))}
      </div>
    </div>
  );
}
