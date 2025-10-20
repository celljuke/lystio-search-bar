import { publicProcedure, router } from "../trpc";
import { searchService } from "@/server/services/search";
import {
  searchInputSchema,
  searchFilterSchema,
  aiSearchRequestSchema,
} from "@/server/services/search/schema";

export const searchRouter = router({
  search: publicProcedure.input(searchInputSchema).query(async ({ input }) => {
    return await searchService.search(input);
  }),

  histogram: publicProcedure
    .input(searchFilterSchema)
    .query(async ({ input }) => {
      return await searchService.getHistogram(input);
    }),

  count: publicProcedure.input(searchFilterSchema).query(async ({ input }) => {
    return await searchService.getCount(input);
  }),

  aiSearch: publicProcedure
    .input(aiSearchRequestSchema)
    .mutation(async ({ input }) => {
      return await searchService.searchWithAi(input);
    }),
});
