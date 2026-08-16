import { beforeEach, describe, expect, it, vi } from "vitest";
import type { TrpcContext } from "./_core/context";

const db = vi.hoisted(() => ({
  clearFlavorSummary: vi.fn(),
  getFlavorSummary: vi.fn(),
  getMyTastingReflection: vi.fn(),
  listApprovedReflectionSignals: vi.fn(),
  listApprovedTastingReflections: vi.fn(),
  listPendingTastingReflections: vi.fn(),
  listTastingReflectionModerationQueue: vi.fn(),
  moderateTastingReflection: vi.fn(),
  saveFlavorSummary: vi.fn(),
  saveTastingReflection: vi.fn(),
}));
const flavor = vi.hoisted(() => ({ generateFlavorSummary: vi.fn() }));

vi.mock("./db", () => db);
vi.mock("./flavorSummary", () => flavor);

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
    db.listApprovedReflectionSignals.mockResolvedValue([]);
    const caller = appRouter.createCaller(context());
    await caller.tastingReflection.submit({ productId: "alto", rating: 5, comment: "A careful cup." });
    expect(db.saveTastingReflection).toHaveBeenCalledWith({ userId: 11, productId: "alto", rating: 5, comment: "A careful cup." });
    expect(db.clearFlavorSummary).toHaveBeenCalledWith("alto");
    await expect(caller.tastingReflection.submit({ productId: "alto", rating: 5, comment: "x" })).rejects.toThrow();
  });

  it("reserves moderation queues and state changes for administrators", async () => {
    db.listPendingTastingReflections.mockResolvedValue([]);
    db.listTastingReflectionModerationQueue.mockResolvedValue([]);
    db.listApprovedReflectionSignals.mockResolvedValue([{ id: 2, rating: 4, comment: "A clear finish.", updatedAt: new Date() }]);
    flavor.generateFlavorSummary.mockResolvedValue({ summaryEn: "Reflections mention a clear finish.", summaryAr: "تذكر الانطباعات نهاية واضحة.", sourceCount: 1, sourceFingerprint: "signal" });
    const admin = appRouter.createCaller(context("admin"));
    await expect(admin.tastingReflection.pending({ productId: "alto" })).resolves.toEqual([]);
    await expect(admin.tastingReflection.moderationQueue({ status: "pending" })).resolves.toEqual([]);
    await admin.tastingReflection.moderate({ id: 1, productId: "alto", status: "approved" });
    expect(db.moderateTastingReflection).toHaveBeenCalledWith({ id: 1, productId: "alto", status: "approved", moderatedBy: 11 });
    expect(db.saveFlavorSummary).toHaveBeenCalledWith(expect.objectContaining({ productId: "alto", sourceCount: 1 }));
    const user = appRouter.createCaller(context("user"));
    await expect(user.tastingReflection.pending({ productId: "alto" })).rejects.toThrow();
    await expect(user.tastingReflection.moderationQueue({ status: "pending" })).rejects.toThrow();
  });

  it("keeps automated flavor summaries unavailable until approved comments exist", async () => {
    db.getFlavorSummary.mockResolvedValue(undefined);
    const caller = appRouter.createCaller(context());
    await expect(caller.tastingReflection.flavorSummary({ productId: "alto" })).resolves.toBeUndefined();
  });
});
