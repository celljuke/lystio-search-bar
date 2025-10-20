import { router } from "./trpc";
import { searchRouter } from "./routers/search";
import { locationRouter } from "./routers/location";

export const appRouter = router({
  search: searchRouter,
  location: locationRouter,
});

export type AppRouter = typeof appRouter;
