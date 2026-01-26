import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getPhotoVotes } from "@/app/actions";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { photoId, userId, voteType, contestId } = body;

    if (!photoId || !userId || !voteType || !contestId) {
      return NextResponse.json(
        { error: "photoId, userId, voteType, and contestId are required" },
        { status: 400 }
      );
    }

    const validVoteTypes = ["OVERALL", "TECHNICAL", "FUNNY"];
    if (!validVoteTypes.includes(voteType)) {
      return NextResponse.json(
        { error: "voteType must be OVERALL, TECHNICAL, or FUNNY" },
        { status: 400 }
      );
    }

    // Check if user already voted this way
    const existingVote = await prisma.vote.findUnique({
      where: {
        voterId_photoId_voteType_contestId: {
          voterId: userId,
          photoId,
          voteType,
          contestId,
        },
      },
    });

    if (existingVote) {
      // Clear the vote
      await prisma.vote.delete({
        where: { id: existingVote.id },
      });
    } else {
      // Add the vote
      await prisma.vote.create({
        data: {
          photoId,
          voterId: userId,
          voteType,
          contestId,
        },
      });
    }

    // Get updated photo votes using the action
    const voteData = await getPhotoVotes(photoId, userId);

    return NextResponse.json({
      id: voteData.photoId,
      totalVotes: voteData.totalVotes,
      userVoteTypes: voteData.userVoteTypes,
    });
  } catch (error) {
    console.error("Error processing vote:", error);
    return NextResponse.json(
      { error: "Failed to process vote" },
      { status: 500 }
    );
  }
}
