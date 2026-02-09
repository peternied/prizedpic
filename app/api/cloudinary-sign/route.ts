import { NextResponse } from "next/server";
import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME!,
  api_key: process.env.NEXT_PUBLIC_CLOUDINARY_API_KEY!,
  api_secret: process.env.NEXT_PUBLIC_CLOUDINARY_API_SECRET!,
});

export async function POST(req: Request) {
  console.log("Signature endpoint called");
  const body = await req.json();
  console.log("Request body:", body);
  
  // The client sends params wrapped in paramsToSign
  const clientParams = body.paramsToSign || {};
  const timestamp = clientParams.timestamp || Math.round(Date.now() / 1000);

  // Sign the exact parameters the client is sending
  const paramsToSign: Record<string, unknown> = {
    ...clientParams,
    timestamp,
  };

  const signature = cloudinary.utils.api_sign_request(
    paramsToSign,
    process.env.NEXT_PUBLIC_CLOUDINARY_API_SECRET!
  );

  console.log("Signature generated:", signature);

  return NextResponse.json({
    timestamp,
    signature,
    cloudName: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
    apiKey: process.env.NEXT_PUBLIC_CLOUDINARY_API_KEY,
  });
}
