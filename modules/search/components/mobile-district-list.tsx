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

interface MobileDistrictListProps {
  city: City;
  selectedDistrictIds: string[];
  onBack: () => void;
  onDistrictToggle: (districtId: string) => void;
  onSelectAll: () => void;
}

export function MobileDistrictList({
  city,
  selectedDistrictIds,
  onBack,
  onDistrictToggle,
  onSelectAll,
}: MobileDistrictListProps) {
  const isAllSelected = selectedDistrictIds.length === city.children.length;

  return (
    <div className="space-y-4 pb-6">
      {/* Header with back button */}
      <div className="flex items-center gap-3 pb-4 border-b border-gray-200">
        <button
          onClick={onBack}
          className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <ChevronLeft className="w-5 h-5 text-gray-600" />
        </button>
        <div className="flex-1">
          <h4 className="text-lg font-semibold text-gray-900">{city.name}</h4>
          <p className="text-sm text-gray-500">Select districts</p>
        </div>
      </div>

      {/* All Districts checkbox */}
      <div className="pb-3 border-b border-gray-200">
        <label className="flex items-center gap-3 p-3 hover:bg-gray-50 rounded-lg cursor-pointer">
          <Checkbox checked={isAllSelected} onCheckedChange={onSelectAll} />
          <div className="flex-1">
            <p className="text-base font-medium text-gray-900">All Districts</p>
            <p className="text-sm text-gray-500">{city.districts} Districts</p>
          </div>
        </label>
      </div>

      {/* District checkboxes */}
      <div className="space-y-1 max-h-[60vh] overflow-y-auto">
        {city.children.map((district) => (
          <label
            key={district.id}
            className="flex items-center gap-3 p-3 hover:bg-gray-50 rounded-lg cursor-pointer"
          >
            <Checkbox
              checked={selectedDistrictIds.includes(district.id)}
              onCheckedChange={() => onDistrictToggle(district.id)}
            />
            <div className="flex-1">
              <p className="text-base text-gray-900">{district.name}</p>
              {district.postal_code && (
                <p className="text-sm text-gray-500">{district.postal_code}</p>
              )}
            </div>
          </label>
        ))}
      </div>
    </div>
  );
}
