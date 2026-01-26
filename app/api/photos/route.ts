import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    const {
      publicId,
      secureUrl,
      title,
      contestId,
      submitterEmail,
      submitterId,
    } = await req.json();

    console.log("[POST /api/photos] Request body:", {
      publicId,
      secureUrl,
      title,
      contestId,
      submitterEmail,
      submitterId,
    });

    if (!publicId || !secureUrl) {
      return NextResponse.json(
        { error: "publicId and secureUrl are required" },
        { status: 400 }
      );
    }

    console.log("[POST /api/photos] Creating photo with publicId:", publicId);
    const created = await prisma.photo.create({
      data: {
        publicId,
        secureUrl,
        title: title?.trim() || null,
        contestId: contestId || null,
        submitterEmail: submitterEmail || null,
        submitterId: submitterId || null,
      },
      select: { id: true },
    });

    console.log("[POST /api/photos] Photo created successfully:", created);
    return NextResponse.json({ id: created.id }, { status: 201 });
  } catch (error) {
    console.error("[POST /api/photos] Error saving photo:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to save photo" },
      { status: 500 }
    );
  }
}
