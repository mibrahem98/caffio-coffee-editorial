import { COOKIE_NAME } from "@shared/const";
import { z } from "zod";
import { coffeeProducts } from "../client/src/lib/mizanCatalog";
import { clearFlavorSummary, getFlavorSummary, getMyTastingReflection, listApprovedReflectionSignals, listApprovedTastingReflections, listPendingTastingReflections, listTastingReflectionModerationQueue, moderateTastingReflection, saveFlavorSummary, saveTastingReflection } from "./db";
import { generateFlavorSummary } from "./flavorSummary";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { adminProcedure, protectedProcedure, publicProcedure, router } from "./_core/trpc";

const productId = z.string().refine(id => coffeeProducts.some(product => product.id === id), "Unknown coffee record");

async function refreshFlavorSummary(productId: string) {
  const signals = await listApprovedReflectionSignals(productId);
  const summary = await generateFlavorSummary(signals);
  if (summary) return saveFlavorSummary({ productId, ...summary });
  return clearFlavorSummary(productId);
}

export const appRouter = router({
    // if you need to use socket.io, read and register route in server/_core/index.ts, all api should start with '/api/' so that the gateway can route correctly
  system: systemRouter,
  auth: router({
    me: publicProcedure.query(opts => opts.ctx.user),
    logout: publicProcedure.mutation(({ ctx }) => {
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
      return {
        success: true,
      } as const;
    }),
  }),
  tastingReflection: router({
    listApproved: publicProcedure.input(z.object({ productId })).query(async ({ input }) => {
      const items = await listApprovedTastingReflections(input.productId);
      const count = items.length;
      const average = count ? Math.round((items.reduce((sum, item) => sum + item.rating, 0) / count) * 10) / 10 : null;
      return { items, count, average };
    }),
    flavorSummary: publicProcedure.input(z.object({ productId })).query(({ input }) => getFlavorSummary(input.productId)),
    mine: protectedProcedure.input(z.object({ productId })).query(({ ctx, input }) =>
      getMyTastingReflection(ctx.user.id, input.productId)),
    submit: protectedProcedure.input(z.object({
      productId,
      rating: z.number().int().min(1).max(5),
      comment: z.string().trim().min(2).max(280),
    })).mutation(async ({ ctx, input }) => {
      const reflection = await saveTastingReflection({ ...input, userId: ctx.user.id });
      await refreshFlavorSummary(input.productId);
      return reflection;
    }),
    pending: adminProcedure.input(z.object({ productId })).query(({ input }) =>
      listPendingTastingReflections(input.productId)),
    moderationQueue: adminProcedure.input(z.object({ status: z.enum(["pending", "approved", "rejected"]).optional() }).optional()).query(({ input }) =>
      listTastingReflectionModerationQueue(input?.status || "pending")),
    moderate: adminProcedure.input(z.object({
      id: z.number().int().positive(),
      productId,
      status: z.enum(["approved", "rejected"]),
    })).mutation(async ({ ctx, input }) => {
      await moderateTastingReflection({ ...input, moderatedBy: ctx.user.id });
      await refreshFlavorSummary(input.productId);
      return { success: true };
    }),
  }),
});

export type AppRouter = typeof appRouter;
