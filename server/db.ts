import { and, desc, eq } from "drizzle-orm";
import { drizzle } from "drizzle-orm/mysql2";
import { InsertUser, tastingReflections, users } from "../drizzle/schema";
import { ENV } from "./_core/env";

let _db: ReturnType<typeof drizzle> | null = null;

export async function getDb() {
  if (!_db && process.env.DATABASE_URL) {
    try {
      _db = drizzle(process.env.DATABASE_URL);
    } catch (error) {
      console.warn("[Database] Failed to connect:", error);
      _db = null;
    }
  }
  return _db;
}

export async function upsertUser(user: InsertUser): Promise<void> {
  if (!user.openId) throw new Error("User openId is required for upsert");
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot upsert user: database not available");
    return;
  }

  const values: InsertUser = { openId: user.openId };
  const updateSet: Record<string, unknown> = {};
  const textFields = ["name", "email", "loginMethod"] as const;
  textFields.forEach(field => {
    if (user[field] === undefined) return;
    const value = user[field] ?? null;
    values[field] = value;
    updateSet[field] = value;
  });
  if (user.lastSignedIn !== undefined) {
    values.lastSignedIn = user.lastSignedIn;
    updateSet.lastSignedIn = user.lastSignedIn;
  }
  if (user.role !== undefined) {
    values.role = user.role;
    updateSet.role = user.role;
  } else if (user.openId === ENV.ownerOpenId) {
    values.role = "admin";
    updateSet.role = "admin";
  }
  if (!values.lastSignedIn) values.lastSignedIn = new Date();
  if (!Object.keys(updateSet).length) updateSet.lastSignedIn = new Date();

  try {
    await db.insert(users).values(values).onDuplicateKeyUpdate({ set: updateSet });
  } catch (error) {
    console.error("[Database] Failed to upsert user:", error);
    throw error;
  }
}

export async function getUserByOpenId(openId: string) {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db.select().from(users).where(eq(users.openId, openId)).limit(1);
  return result[0];
}

export async function listApprovedTastingReflections(productId: string) {
  const db = await getDb();
  if (!db) return [];
  return db.select({
    id: tastingReflections.id,
    productId: tastingReflections.productId,
    rating: tastingReflections.rating,
    comment: tastingReflections.comment,
    createdAt: tastingReflections.createdAt,
  }).from(tastingReflections).where(and(
    eq(tastingReflections.productId, productId),
    eq(tastingReflections.status, "approved"),
  )).orderBy(desc(tastingReflections.createdAt)).limit(12);
}

export async function getMyTastingReflection(userId: number, productId: string) {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db.select().from(tastingReflections).where(and(
    eq(tastingReflections.userId, userId),
    eq(tastingReflections.productId, productId),
  )).limit(1);
  return result[0];
}

export async function saveTastingReflection(input: { userId: number; productId: string; rating: number; comment: string }) {
  const db = await getDb();
  if (!db) throw new Error("Tasting reflections are unavailable while the database is disconnected.");
  await db.insert(tastingReflections).values({
    userId: input.userId,
    productId: input.productId,
    rating: input.rating,
    comment: input.comment,
    status: "pending",
  }).onDuplicateKeyUpdate({
    set: { rating: input.rating, comment: input.comment, status: "pending", updatedAt: new Date() },
  });
  return getMyTastingReflection(input.userId, input.productId);
}

export async function listPendingTastingReflections(productId: string) {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(tastingReflections).where(and(
    eq(tastingReflections.productId, productId),
    eq(tastingReflections.status, "pending"),
  )).orderBy(desc(tastingReflections.createdAt)).limit(24);
}

export async function moderateTastingReflection(id: number, status: "approved" | "rejected") {
  const db = await getDb();
  if (!db) throw new Error("Tasting reflections are unavailable while the database is disconnected.");
  await db.update(tastingReflections).set({ status, updatedAt: new Date() }).where(eq(tastingReflections.id, id));
}
