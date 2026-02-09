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
  } catch (error: unknown) {
    console.error("Error saving photo:", error instanceof Error ? error.message : "Unknown error");
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
function mapPhotoWithVotes(photo: Photo, userId?: string) {
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
  } catch (error: unknown) {
    console.error("Error loading contests:", error instanceof Error ? error.message : "Unknown error");
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

  return photos.map((photo: any) => mapPhotoWithVotes(photo, userId));
}

export async function getContestInfo(contestId: string) {
  "use server";

  if (!contestId) {
    throw new Error("Contest ID is required");
  }

  const contest = await prisma.contest.findUnique({
    where: { id: contestId },
  });

  if (!contest) {
    throw new Error("Contest not found");
  }

  return {
    id: contest.id,
    name: contest.name,
    endsAt: contest.endsAt,
    isClosed: contest.endsAt ? new Date() > contest.endsAt : false,
  };
}

// Types
type Photo = {
  id: string;
  publicId: string;
  secureUrl: string;
  title: string;
  submitterEmail: string;
  submitterId: string;
  contestId: string;
  submittedAt: Date;
  votes: Vote[];
};

type Vote = {
  voterId: string;
  voteType: "OVERALL" | "TECHNICAL" | "FUNNY";
};

type Contest = {
  id: string;
  name: string;
  endsAt: Date;
  isClosed: boolean;
};
