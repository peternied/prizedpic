"use server";

import { prisma } from "@/lib/prisma";

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
        submitterId: userId,
      },
    });
    return photo;
  } catch (error) {
    console.error("Error saving photo:", error);
    throw new Error("Failed to save photo");
  }
}

export async function loadPhotosForContest(contestId: string) {
  "use server";

  if (!contestId) {
    throw new Error("Contest ID is required");
  }

  const photos = await prisma.photo.findMany({
    where: {
      contestId,
    },
    orderBy: {
      submittedAt: "desc",
    },
  });

  return photos;
}

// Shared mapper for consistent photo+votes shape
function mapPhotoWithVotes(photo: any, userId?: string) {
  const userVotes = userId ? photo.votes.filter((vote: any) => vote.voterId === userId) : [];
  const userVoteTypes = {
    OVERALL: userVotes.some((v: any) => v.voteType === "OVERALL"),
    TECHNICAL: userVotes.some((v: any) => v.voteType === "TECHNICAL"),
    FUNNY: userVotes.some((v: any) => v.voteType === "FUNNY"),
  };

  return {
    id: photo.id,
    publicId: photo.publicId,
    secureUrl: photo.secureUrl,
    title: photo.title,
    submitterEmail: photo.submitterEmail,
    submitterId: photo.submitterId,
    contestId: photo.contestId,
    submittedAt: photo.submittedAt,
    totalVotes: {
      OVERALL: photo.votes.filter((v: any) => v.voteType === "OVERALL").length,
      TECHNICAL: photo.votes.filter((v: any) => v.voteType === "TECHNICAL").length,
      FUNNY: photo.votes.filter((v: any) => v.voteType === "FUNNY").length,
    },
    userVoteTypes,
  };
}

export async function getPhotoVotes(photoId: string, userId?: string) {
  "use server";

  if (!photoId) {
    throw new Error("Photo ID is required");
  }

  const photo = await prisma.photo.findUnique({
    where: { id: photoId },
    include: { votes: true },
  });

  if (!photo) {
    throw new Error("Photo not found");
  }

  return mapPhotoWithVotes(photo, userId);
}

export async function loadContests(includeClosed: boolean) {
  try {
    const now = new Date();
    const contests = await prisma.contest.findMany({
      where: {
        endsAt: includeClosed ? undefined : { gt: now },
      },
      orderBy: {
        createdAt: "desc",
      },
    });
    return contests;
  } catch (error) {
    console.error("Error loading contests:", error);
    throw new Error("Failed to load contests");
  }
}

export async function loadContestPhotosWithVotes(contestId: string, userId?: string) {
  "use server";

  if (!contestId) {
    throw new Error("Contest ID is required");
  }

  const photos = await prisma.photo.findMany({
    where: { contestId },
    include: { votes: true },
    orderBy: { submittedAt: "desc" },
  });

  return photos.map((photo) => mapPhotoWithVotes(photo, userId));
}
