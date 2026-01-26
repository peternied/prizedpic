"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { CldUploadWidget } from "next-cloudinary";

type UploadResult = {
  info?: {
    public_id?: string;
    secure_url?: string;
  };
};

export default function SubmitPage() {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [uploading, setUploading] = useState(false);
  const [uploadedUrl, setUploadedUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const signatureEndpoint = useMemo(() => {
    console.log("Component mounted, signatureEndpoint:", "/api/cloudinary-sign");
    return "/api/cloudinary-sign";
  }, []);

  async function persistPhoto(publicId: string, secureUrl: string) {
    const res = await fetch("/api/photos", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ publicId, secureUrl, title }),
    });

    const data = await res.json().catch(() => ({}));

    if (!res.ok) {
      throw new Error(data?.error || "Failed to save photo");
    }

    return data as { id: string };
  }

  return (
    <main className="mx-auto max-w-2xl p-6">
      <h1 className="text-2xl font-semibold">Submit a photo</h1>
      <p className="mt-2 text-sm text-muted-foreground">
        Upload your entry. After upload, it’ll show up in battles.
      </p>

      <div className="mt-6 space-y-3">
        <label className="block text-sm font-medium">Title (optional)</label>
        <input
          className="w-full rounded-md border px-3 py-2"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="e.g., Snow day masterpiece"
          maxLength={80}
        />
      </div>

      <div className="mt-6">
        <CldUploadWidget
          signatureEndpoint={signatureEndpoint}
          options={{
            folder: "photo-contest",
            sources: ["local", "camera"],
            multiple: false,
            maxFiles: 1,
            clientAllowedFormats: ["png", "jpg", "jpeg", "webp", "heic"],
            maxFileSize: 15_000_000, // 15MB
            cropping: false,
          }}
          onSuccess={async (result) => {
            console.log("onUpload called with result:", result);
            const r = result as UploadResult;
            const publicId = r?.info?.public_id;
            const secureUrl = r?.info?.secure_url;

            if (!publicId || !secureUrl) {
              setError("Upload finished but missing Cloudinary metadata.");
              return;
            }

            setError(null);
            setUploading(true);

            try {
              const saved = await persistPhoto(publicId, secureUrl);
              console.log("Photo saved successfully:", saved);
              setUploadedUrl(secureUrl);
            } catch (e) {
              console.error("Error saving photo:", e);
              setError(e instanceof Error ? e.message : "Failed to save photo");
            } finally {
              setUploading(false);
            }
          }}
          onError={(e) => {
            console.error("CldUploadWidget error:", e);
            setError(typeof e === "string" ? e : "Upload failed");
          }}
        >
          {({ open }) => (
            <button
              className="rounded-md bg-black px-4 py-2 text-white disabled:opacity-50"
              onClick={() => open()}
              disabled={uploading}
              type="button"
            >
              {uploading ? "Saving..." : "Upload photo"}
            </button>
          )}
        </CldUploadWidget>

        {error && (
          <p className="mt-3 text-sm text-red-600">
            {error}
          </p>
        )}

        {uploadedUrl && !uploading && (
          <div className="mt-6 space-y-3">
            <p className="text-sm">Uploaded ✅</p>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={uploadedUrl}
              alt="Uploaded preview"
              className="w-full rounded-lg border"
            />

            <div className="flex gap-3">
              <button
                className="rounded-md border px-4 py-2"
                onClick={() => {
                  setUploadedUrl(null);
                  setTitle("");
                }}
                type="button"
              >
                Submit another
              </button>
              <button
                className="rounded-md bg-black px-4 py-2 text-white"
                onClick={() => router.push("/vote")}
                type="button"
              >
                Start voting
              </button>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
