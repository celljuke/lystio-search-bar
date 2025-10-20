import { useState } from "react";
import { trpc } from "@/lib/trpc/client";
import { useSearchStore } from "../store";
import { useRentBuyMode } from "./use-rent-buy-mode";

/**
 * Hook for AI-powered search
 * Converts natural language prompts to search filters
 */
export function useAiSearch() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const { setMode } = useRentBuyMode();
  const { setFilters, filters } = useSearchStore();

  // Mutation for AI search
  const aiSearchMutation = trpc.search.aiSearch.useMutation();

  const openDialog = () => setIsDialogOpen(true);
  const closeDialog = () => setIsDialogOpen(false);

  const handleAiSearch = async (prompt: string) => {
    try {
      // Call AI search API
      const aiResponse = await aiSearchMutation.mutateAsync({ prompt });

      // Map AI response to our filter format
      const newFilters = { ...filters };

      // Update rent/buy mode if specified
      if (aiResponse.rentType && aiResponse.rentType.length > 0) {
        const rentType = aiResponse.rentType[0];
        setMode(rentType as "rent" | "buy");
      }

      // Map location (withinId or bbox)
      if (aiResponse.withinId && aiResponse.withinId.length > 0) {
        newFilters.locationData = {
          ...newFilters.locationData,
          withinId: aiResponse.withinId,
        };
      } else if (aiResponse.bbox) {
        newFilters.locationData = {
          ...newFilters.locationData,
          bbox: aiResponse.bbox,
        };
      }

      // Map price range
      if (aiResponse.rent) {
        const [min, max] = aiResponse.rent;
        if (min !== null || max !== null) {
          newFilters.priceRange = {
            min: min ?? 0,
            max: max ?? 10000000,
            currency: "EUR",
          };
        }
      }

      // Map property types (type/subType)
      if (aiResponse.type && aiResponse.type.length > 0) {
        // We'll need to reverse-map the numeric type IDs to our category IDs
        // For now, we'll set a generic category
        // TODO: Create a reverse mapping from typeId/subTypeId to categoryId
        const typeId = aiResponse.type[0];

        // Basic mapping (this should be enhanced based on categories.ts)
        let categoryId = "apartments"; // default
        if (typeId === 8) categoryId = "apartments";
        else if (typeId === 9) categoryId = "houses";
        else if (typeId === 10) categoryId = "commercial";

        newFilters.propertyType = {
          categoryId,
          categoryName:
            categoryId.charAt(0).toUpperCase() + categoryId.slice(1),
          subcategories: aiResponse.subType?.map(String) || ["all"],
        };
      }

      // Update filters
      setFilters(newFilters);

      // Close dialog
      closeDialog();
    } catch (error) {
      console.error("AI search failed:", error);
      // TODO: Show error toast
    }
  };

  return {
    isDialogOpen,
    openDialog,
    closeDialog,
    handleAiSearch,
    isLoading: aiSearchMutation.isPending,
  };
}
