import { NextResponse } from "next/server";
import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME!,
  api_key: process.env.CLOUDINARY_API_KEY!,
  api_secret: process.env.CLOUDINARY_API_SECRET!,
});

export async function POST(req: Request) {
  const body = await req.json();
  const timestamp = Math.round(Date.now() / 1000);

  // Restrict what the client is allowed to request-sign
  const paramsToSign = {
    timestamp,
    folder: "photo-contest",
    // optionally: public_id, tags, etc
    ...("public_id" in body ? { public_id: body.public_id } : {}),
  };

  const signature = cloudinary.utils.api_sign_request(
    paramsToSign,
    process.env.CLOUDINARY_API_SECRET!
  );

  return NextResponse.json({
    timestamp,
    signature,
    cloudName: process.env.CLOUDINARY_CLOUD_NAME,
    apiKey: process.env.CLOUDINARY_API_KEY,
    folder: "photo-contest",
  });
}
