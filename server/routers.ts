import { COOKIE_NAME } from "@shared/const";
import { z } from "zod";
import { coffeeProducts } from "../client/src/lib/mizanCatalog";
import { getMyTastingReflection, listApprovedTastingReflections, listPendingTastingReflections, moderateTastingReflection, saveTastingReflection } from "./db";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { adminProcedure, protectedProcedure, publicProcedure, router } from "./_core/trpc";

const productId = z.string().refine(id => coffeeProducts.some(product => product.id === id), "Unknown coffee record");

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
    mine: protectedProcedure.input(z.object({ productId })).query(({ ctx, input }) =>
      getMyTastingReflection(ctx.user.id, input.productId)),
    submit: protectedProcedure.input(z.object({
      productId,
      rating: z.number().int().min(1).max(5),
      comment: z.string().trim().min(2).max(280),
    })).mutation(({ ctx, input }) => saveTastingReflection({ ...input, userId: ctx.user.id })),
    pending: adminProcedure.input(z.object({ productId })).query(({ input }) =>
      listPendingTastingReflections(input.productId)),
    moderate: adminProcedure.input(z.object({
      id: z.number().int().positive(),
      status: z.enum(["approved", "rejected"]),
    })).mutation(({ input }) => moderateTastingReflection(input.id, input.status)),
  }),
});

export type AppRouter = typeof appRouter;
