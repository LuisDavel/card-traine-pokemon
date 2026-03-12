"use server";

import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { trainerProfile } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { headers } from "next/headers";

export async function getMyProfile() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) return null;

  const [profile] = await db
    .select()
    .from(trainerProfile)
    .where(eq(trainerProfile.userId, session.user.id));

  return profile || null;
}

export async function saveProfile(data: {
  username: string;
  trainerName: string;
  avatarUrl?: string;
  favoriteType?: string;
  city?: string;
  badges?: string[];
  pokemonCardId?: string;
  pokemonCardImage?: string;
  pokemonCardName?: string;
}) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) throw new Error("Não autenticado");

  const [existing] = await db
    .select()
    .from(trainerProfile)
    .where(eq(trainerProfile.userId, session.user.id));

  if (existing) {
    await db
      .update(trainerProfile)
      .set({
        ...data,
        updatedAt: new Date(),
      })
      .where(eq(trainerProfile.userId, session.user.id));
  } else {
    await db.insert(trainerProfile).values({
      userId: session.user.id,
      ...data,
    });
  }

  return { success: true };
}

export async function getProfileByUsername(username: string) {
  const [profile] = await db
    .select()
    .from(trainerProfile)
    .where(eq(trainerProfile.username, username));

  return profile || null;
}
