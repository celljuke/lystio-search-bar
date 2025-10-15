import { useCallback, useMemo } from "react";
import { Category, PropertyTypeFilter } from "../types";
import { CATEGORIES } from "../constants/categories";
import { useSearchStore } from "../store";

export function useCategory(
  onSelectCategory: (
    categoryName: string,
    propertyTypeFilter: PropertyTypeFilter,
    shouldClose: boolean
  ) => void
) {
  const {
    selectedCategoryId,
    selectedSubcategories,
    setSelectedCategory: setStoredCategory,
  } = useSearchStore();

  // Find the selected category from CATEGORIES
  const selectedCategory = useMemo(() => {
    return (
      CATEGORIES.find((cat) => cat.id === selectedCategoryId) || CATEGORIES[0]
    );
  }, [selectedCategoryId]);

  const handleCategoryClick = useCallback(
    (category: Category) => {
      const propertyTypeFilter: PropertyTypeFilter = {
        categoryId: category.id,
        categoryName: category.name,
        subcategories: category.hasSubcategories ? ["all"] : [],
      };

      if (!category.hasSubcategories) {
        // Categories without subcategories - select immediately and close
        setStoredCategory(category.id, []);
        onSelectCategory(category.name, propertyTypeFilter, true);
      } else {
        // Categories with subcategories - reset to "Select All" and DON'T close
        setStoredCategory(category.id, ["all"]);
        // Still update the filter to show the main category name
        onSelectCategory(category.name, propertyTypeFilter, false);
      }
    },
    [onSelectCategory, setStoredCategory]
  );

  const handleSubcategoryToggle = useCallback(
    (subcategoryId: string, checked: boolean) => {
      let newSelectedSubcategories: string[];

      if (subcategoryId === "all") {
        // Toggle "Select All"
        if (checked) {
          // Select all
          newSelectedSubcategories = ["all"];
        } else {
          // Deselect all
          newSelectedSubcategories = [];
        }
      } else {
        // Toggle individual subcategory
        if (checked) {
          // Add subcategory and remove "all"
          newSelectedSubcategories = selectedSubcategories
            .filter((id) => id !== "all")
            .concat(subcategoryId);
        } else {
          // Remove subcategory
          newSelectedSubcategories = selectedSubcategories.filter(
            (id) => id !== subcategoryId
          );
        }

        // If no subcategories are selected, select "all" by default
        if (newSelectedSubcategories.length === 0) {
          newSelectedSubcategories = ["all"];
        }
      }

      // Update store with new subcategories
      setStoredCategory(selectedCategoryId || "", newSelectedSubcategories);

      // Build the category string
      const categoryString = buildCategoryString(
        selectedCategory,
        newSelectedSubcategories
      );

      // Build the filter object
      const propertyTypeFilter: PropertyTypeFilter = {
        categoryId: selectedCategory.id,
        categoryName: selectedCategory.name,
        subcategories: newSelectedSubcategories,
      };

      // Update parent (don't close - user might want to select more)
      onSelectCategory(categoryString, propertyTypeFilter, false);
    },
    [
      selectedCategory,
      selectedSubcategories,
      selectedCategoryId,
      onSelectCategory,
      setStoredCategory,
    ]
  );

  const buildCategoryString = (
    category: Category | null,
    subcategoryIds: string[]
  ): string => {
    if (!category) return "";

    // Always return the main category name for display
    // The actual selected subcategories are tracked internally in the store
    return category.name;
  };

  const isSubcategorySelected = useCallback(
    (subcategoryId: string): boolean => {
      return selectedSubcategories.includes(subcategoryId);
    },
    [selectedSubcategories]
  );

  const getSelectedSubcategoryNames = useCallback((): string[] => {
    if (!selectedCategory) return [];

    if (selectedSubcategories.includes("all")) {
      return ["all"];
    }

    return selectedSubcategories
      .map((id) => {
        const sub = selectedCategory.subcategories?.find((s) => s.id === id);
        return sub?.name;
      })
      .filter(Boolean) as string[];
  }, [selectedCategory, selectedSubcategories]);

  return {
    categories: CATEGORIES,
    selectedCategory,
    selectedSubcategories,
    handleCategoryClick,
    handleSubcategoryToggle,
    isSubcategorySelected,
    getSelectedSubcategoryNames,
  };
}
