import { clusterRouter } from "./routers/clusterRouter";
import { createVPCRouter } from "./routers/vpcRouter";
import { topicRouter } from "./routers/topicsRouter";
import { createTRPCRouter } from "~/server/api/trpc";

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
  cluster: clusterRouter,
  vpc: createVPCRouter,
  topic: topicRouter
});

// export type definition of API
export type AppRouter = typeof appRouter;
