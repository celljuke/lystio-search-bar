"use client";

import { ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { useCategory } from "../hooks/use-category";
import { PropertyTypeFilter } from "../types";

interface CategoryPopoverProps {
  onSelectCategory: (
    categoryName: string,
    propertyTypeFilter: PropertyTypeFilter,
    shouldClose: boolean
  ) => void;
}

export function CategoryPopover({ onSelectCategory }: CategoryPopoverProps) {
  const {
    categories,
    selectedCategory,
    handleCategoryClick,
    handleSubcategoryToggle,
    isSubcategorySelected,
  } = useCategory(onSelectCategory);

  return (
    <div className="absolute top-full left-0 mt-2 bg-white border border-gray-200 rounded-2xl shadow-xl z-[100] overflow-hidden flex">
      {/* Left Panel - Categories */}
      <div className="w-64 border-r border-gray-200">
        <div className="p-3">
          <h3 className="text-base font-semibold text-gray-900 mb-3 px-2">
            Category
          </h3>
          <div className="space-y-1 max-h-[400px] overflow-y-auto">
            {categories.map((category) => {
              const Icon = category.icon;
              const isSelected = selectedCategory?.id === category.id;

              return (
                <button
                  key={category.id}
                  onClick={() => handleCategoryClick(category)}
                  className={cn(
                    "w-full flex items-center justify-between px-3 py-2.5 rounded-lg transition-colors text-left group",
                    isSelected
                      ? "bg-purple-50 text-[#A540F3]"
                      : "hover:bg-gray-50 text-gray-700"
                  )}
                >
                  <div className="flex items-center gap-3 flex-1 min-w-0">
                    <Icon
                      className={cn(
                        "w-5 h-5 flex-shrink-0",
                        isSelected ? "text-[#A540F3]" : "text-gray-500"
                      )}
                    />
                    <span className="text-sm font-medium truncate">
                      {category.name}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 flex-shrink-0">
                    <span
                      className={cn(
                        "text-xs font-medium",
                        isSelected ? "text-[#A540F3]" : "text-gray-500"
                      )}
                    >
                      {category.count.toLocaleString()}
                    </span>
                    {category.hasSubcategories && (
                      <ChevronRight
                        className={cn(
                          "w-4 h-4",
                          isSelected ? "text-[#A540F3]" : "text-gray-400"
                        )}
                      />
                    )}
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Right Panel - Subcategories */}
      {selectedCategory?.hasSubcategories && selectedCategory.subcategories && (
        <div className="w-80">
          <div className="p-4">
            <h3 className="text-base font-semibold text-gray-900 mb-4">
              {selectedCategory.name}
            </h3>
            <div className="space-y-2 max-h-[400px] overflow-y-auto">
              {selectedCategory.subcategories.map((subcategory) => {
                const isChecked = isSubcategorySelected(subcategory.id);
                const isSelectAll = subcategory.id === "all";

                return (
                  <div
                    key={subcategory.id}
                    className="flex items-center justify-between hover:bg-gray-50 rounded-lg p-2 -mx-2 transition-colors"
                  >
                    <div className="flex items-center space-x-3 flex-1">
                      <Checkbox
                        id={subcategory.id}
                        checked={isChecked}
                        onCheckedChange={(checked) =>
                          handleSubcategoryToggle(
                            subcategory.id,
                            checked as boolean
                          )
                        }
                        className="border-gray-300 data-[state=checked]:bg-[#A540F3] data-[state=checked]:border-[#A540F3]"
                      />
                      <Label
                        htmlFor={subcategory.id}
                        className={cn(
                          "text-sm cursor-pointer flex-1",
                          isSelectAll
                            ? "font-semibold text-gray-900"
                            : "font-normal text-gray-900"
                        )}
                      >
                        {subcategory.name}
                      </Label>
                    </div>
                    {!isSelectAll && (
                      <span className="text-xs font-medium text-gray-500 ml-2">
                        {subcategory.count.toLocaleString()}
                      </span>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
