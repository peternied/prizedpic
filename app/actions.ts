"use server";

import { prisma } from "@/lib/prisma";

export async function loadActiveContests() {
  try {
    const now = new Date();
    const contests = await prisma.contest.findMany({
      where: {
        endsAt: {
          gt: now,
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });
    console.log(`Contests: ${JSON.stringify(contests)}`);
    return contests;
  } catch (error) {
    console.error("Error loading contests:", error);
    throw new Error("Failed to load contests");
  }
}

export async function submitPhoto({
  publicId,
  secureUrl,
  title,
  email,
  userId,
  contestId,
}: {
  publicId: string;
  secureUrl: string;
  title: string;
  email: string;
  userId: string;
  contestId: string;
}) {
  try {
    const photo = await prisma.photo.create({
      data: {
        publicId,
        secureUrl,
        title: title || null,
        contestId,
        submitterEmail: email,
        submitterId: userId
      },
    });
    return photo;
  } catch (error) {
    console.error("Error saving photo:", error);
    throw new Error("Failed to save photo");
  }
}
