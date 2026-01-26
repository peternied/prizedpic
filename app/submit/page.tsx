"use client";

import { useMemo, useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { CldUploadWidget } from "next-cloudinary";
import { getUserId } from "@/lib/userIdGenerator";
import { loadContests } from "@/app/actions";
import { ContestSelector } from "./components/ContestSelector";
import { Contest } from "@/lib/generated/prisma/client";

type UploadResult = {
  info?: {
    public_id?: string;
    secure_url?: string;
  };
};

export default function SubmitPage() {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [email, setEmail] = useState("");
  const [userId, setUserId] = useState("");
  const [uploading, setUploading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [uploadedUrl, setUploadedUrl] = useState<string | null>(null);
  const [uploadedPublicId, setUploadedPublicId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [contests, setContests] = useState<Contest[]>([]);
  const [contestId, setContestId] = useState("");
  const [loadingContests, setLoadingContests] = useState(false);

  const signatureEndpoint = useMemo(() => {
    console.log("Component mounted, signatureEndpoint:", "/api/cloudinary-sign");
    return "/api/cloudinary-sign";
  }, []);

  useEffect(() => {
    setUserId(getUserId());
    if (typeof window !== "undefined") {
      const storedEmail = localStorage.getItem("userEmail");
      if (storedEmail) setEmail(storedEmail);
    }
  }, []);

  useEffect(() => {
    const fetchContests = async () => {
      setLoadingContests(true);
      try {
        const data = await loadContests(false);
        setContests(data || []);
        if (data && data.length > 0) {
          setContestId(data[0].id);
        }
      } catch (err) {
        console.error("Error loading contests:", err);
        setError(err instanceof Error ? err.message : "Failed to load contests");
      } finally {
        setLoadingContests(false);
      }
    };
    fetchContests();
  }, []);

  const updateEmail = (value: string) => {
    setEmail(value);
    if (typeof window !== "undefined") {
      if (value) localStorage.setItem("userEmail", value);
      else localStorage.removeItem("userEmail");
    }
  };

  async function persistPhoto(publicId: string, secureUrl: string) {
    const res = await fetch("/api/photos", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        publicId,
        secureUrl,
        title,
        email,
        userId,
        contestId,
        submitterEmail: email || null,
        submitterId: userId || null,
      }),
    });

    if (!res.ok) {
      throw new Error("Failed to save photo");
    }

    return await res.json();
  }

  async function handleSubmit() {
    if (!contestId) {
      setError("Please choose a contest.");
      return;
    }

    const selectedContest = contests.find((c) => c.id === contestId);
    if (selectedContest?.submissionsClosedAt && new Date(selectedContest.submissionsClosedAt) < new Date()) {
      setError("Submissions for this contest have closed.");
      return;
    }

    if (!uploadedPublicId || !uploadedUrl) {
      setError("No photo uploaded");
      return;
    }

    setError(null);
    setSubmitting(true);

    try {
      const saved = await persistPhoto(uploadedPublicId, uploadedUrl);
      console.log("Photo saved successfully:", saved);
      setUploadedUrl(null);
      setUploadedPublicId(null);
      setTitle("");
      updateEmail("");
      setContestId("");
      router.push("/browse");
    } catch (e) {
      console.error("Error saving photo:", e);
      setError(e instanceof Error ? e.message : "Failed to save photo");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <main className="mx-auto max-w-2xl p-6">
      <h1 className="text-2xl font-semibold">Submit a photo</h1>
      <ContestSelector
        contests={contests}
        contestId={contestId}
        loadingContests={loadingContests}
        onChange={setContestId}
      />

      <p className="mt-2 text-sm text-muted-foreground">
        Upload your entry. After uploading and annotating it, it'll show up in battles.
      </p>

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
          onSuccess={(result) => {
            console.log("onUpload called with result:", result);
            const r = result as UploadResult;
            const publicId = r?.info?.public_id;
            const secureUrl = r?.info?.secure_url;

            if (!publicId || !secureUrl) {
              setError("Upload finished but missing Cloudinary metadata.");
              return;
            }

            setError(null);
            setUploadedPublicId(publicId);
            setUploadedUrl(secureUrl);
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
              disabled={uploading || !!uploadedUrl}
              type="button"
            >
              {uploading ? "Uploading..." : "Upload photo"}
            </button>
          )}
        </CldUploadWidget>

        {error && (
          <p className="mt-3 text-sm text-red-600">
            {error}
          </p>
        )}

        {uploadedUrl && (
          <div className="mt-6 space-y-4">
            <p className="text-sm font-medium">Uploaded ✅</p>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={uploadedUrl}
              alt="Uploaded preview"
              className="w-full rounded-lg border"
            />

            <div className="space-y-3">
              <div>
                <label className="block text-sm font-medium">Title (optional)</label>
                <input
                  className="w-full rounded-md border px-3 py-2 mt-1"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g., Snow day masterpiece"
                  maxLength={80}
                />
              </div>

              <div>
                <label className="block text-sm font-medium">Email (optional)</label>
                <input
                  className="w-full rounded-md border px-3 py-2 mt-1"
                  value={email}
                  onChange={(e) => updateEmail(e.target.value)}
                  placeholder="your.email@example.com"
                  type="email"
                />
              </div>

              <div>
                <label className="block text-sm font-medium">Your User ID</label>
                <input
                  className="w-full rounded-md border px-3 py-2 mt-1"
                  value={userId}
                  readOnly
                  disabled
                />
              </div>
            </div>

            <div className="flex gap-3">
              <button
                className="rounded-md border px-4 py-2"
                onClick={() => {
                  setUploadedUrl(null);
                  setUploadedPublicId(null);
                  setTitle("");
                  updateEmail("");
                  setContestId("");
                }}
                type="button"
                disabled={submitting}
              >
                Upload a different image
              </button>
              <button
                className="rounded-md bg-black px-4 py-2 text-white disabled:opacity-50"
                onClick={handleSubmit}
                type="button"
                disabled={submitting || !contestId}
              >
                {submitting ? "Submitting..." : "Submit"}
              </button>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
