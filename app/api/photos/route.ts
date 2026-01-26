import { NextResponse } from "next/server";
import { prisma } from '../../../lib/prisma'

export const runtime = "nodejs";

type Body = {
  publicId: string;
  secureUrl: string;
  title?: string;
};

export async function POST(req: Request) {
  const url = process.env.POSTGRES_URL ?? "";
  console.log("[db] DATABASE_URL host:", (() => {
    try { return new URL(url).host; } catch { return "UNPARSEABLE"; }
  })());
  console.log("[db] DATABASE_URL protocol:", (() => {
    try { return new URL(url).protocol; } catch { return "UNPARSEABLE"; }
  })());


  try {
    await prisma.$queryRaw`SELECT 1`;

    const body = (await req.json()) as Partial<Body>;
    console.log("[POST /api/photos] Request body:", body);

    if (!body.publicId || !body.secureUrl) {
      return NextResponse.json(
        { error: "publicId and secureUrl are required" },
        { status: 400 }
      );
    }

    console.log("[POST /api/photos] Creating photo with publicId:", body.publicId);
    const created = await prisma.photo.create({
      data: {
        publicId: body.publicId,
        secureUrl: body.secureUrl,
        title: body.title?.trim() || null,
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
