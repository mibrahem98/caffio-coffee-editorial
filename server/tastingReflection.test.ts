import { beforeEach, describe, expect, it, vi } from "vitest";
import type { TrpcContext } from "./_core/context";

const db = vi.hoisted(() => ({
  getMyTastingReflection: vi.fn(),
  listApprovedTastingReflections: vi.fn(),
  listPendingTastingReflections: vi.fn(),
  moderateTastingReflection: vi.fn(),
  saveTastingReflection: vi.fn(),
}));

vi.mock("./db", () => db);

import { appRouter } from "./routers";

function context(role: "user" | "admin" = "user"): TrpcContext {
  return {
    user: {
      id: 11,
      openId: "reflection-tester",
      name: "Reflection tester",
      email: "tester@example.com",
      loginMethod: "manus",
      role,
      createdAt: new Date(),
      updatedAt: new Date(),
      lastSignedIn: new Date(),
    },
    req: { protocol: "https", headers: {} } as TrpcContext["req"],
    res: {} as TrpcContext["res"],
  };
}

describe("tasting reflections", () => {
  beforeEach(() => vi.clearAllMocks());

  it("returns approved reflections only and calculates an approved-only summary", async () => {
    db.listApprovedTastingReflections.mockResolvedValue([
      { id: 1, productId: "alto", rating: 4, comment: "Measured sweetness.", createdAt: new Date() },
      { id: 2, productId: "alto", rating: 5, comment: "Clear finish.", createdAt: new Date() },
    ]);
    const caller = appRouter.createCaller(context());
    const result = await caller.tastingReflection.listApproved({ productId: "alto" });
    expect(result).toMatchObject({ count: 2, average: 4.5 });
    expect(db.listApprovedTastingReflections).toHaveBeenCalledWith("alto");
  });

  it("submits one bounded reflection through the authenticated user and leaves moderation to the backend", async () => {
    db.saveTastingReflection.mockResolvedValue({ id: 1, status: "pending", rating: 5, comment: "A careful cup." });
    const caller = appRouter.createCaller(context());
    await caller.tastingReflection.submit({ productId: "alto", rating: 5, comment: "A careful cup." });
    expect(db.saveTastingReflection).toHaveBeenCalledWith({ userId: 11, productId: "alto", rating: 5, comment: "A careful cup." });
    await expect(caller.tastingReflection.submit({ productId: "alto", rating: 5, comment: "x" })).rejects.toThrow();
  });

  it("reserves pending queues and moderation actions for administrators", async () => {
    db.listPendingTastingReflections.mockResolvedValue([]);
    const admin = appRouter.createCaller(context("admin"));
    await expect(admin.tastingReflection.pending({ productId: "alto" })).resolves.toEqual([]);
    await admin.tastingReflection.moderate({ id: 1, status: "approved" });
    expect(db.moderateTastingReflection).toHaveBeenCalledWith(1, "approved");
    const user = appRouter.createCaller(context("user"));
    await expect(user.tastingReflection.pending({ productId: "alto" })).rejects.toThrow();
  });
});
