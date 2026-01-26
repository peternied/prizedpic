"use client";

import { useState, useEffect } from "react";
import { loadContests, loadContestPhotosWithVotes } from "@/app/actions";
import { ContestSelector } from "@/app/submit/components/ContestSelector";
import { ImageCard } from "./components/ImageCard";

type Photo = {
  id: string;
  publicId: string;
  secureUrl: string;
  title: string | null;
  totalVotes: {
    OVERALL: number;
    TECHNICAL: number;
    FUNNY: number;
  };
  userVoteTypes: {
    OVERALL: boolean;
    TECHNICAL: boolean;
    FUNNY: boolean;
  };
};

type ContestListItem = {
  id: string;
  name: string;
  description: string | null;
  createdAt: Date;
  submissionsClosedAt: Date | null;
  endsAt: Date | null;
};

export default function BrowsePage() {
  const [contests, setContests] = useState<ContestListItem[]>([]);
  const [contestId, setContestId] = useState("");
  const [loadingContests, setLoadingContests] = useState(false);
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [loadingPhotos, setLoadingPhotos] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchContests = async () => {
      setLoadingContests(true);
      try {
        const data = await loadContests(true);
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

  useEffect(() => {
    if (!contestId) return;

    const fetchPhotos = async () => {
      setLoadingPhotos(true);
      setError(null);
      try {
        // Use new action to get photos + votes + user vote status
        const data = await loadContestPhotosWithVotes(contestId);
        setPhotos(data);
      } catch (err) {
        console.error("Error loading photos:", err);
        setError(err instanceof Error ? err.message : "Failed to load photos");
      } finally {
        setLoadingPhotos(false);
      }
    };

    fetchPhotos();
  }, [contestId]);

  const handleVote = async (photoId: string, voteType: "OVERALL" | "TECHNICAL" | "FUNNY") => {
    try {
      const response = await fetch("/api/votes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          photoId,
          voteType,
          contestId,
        }),
      });

      if (!response.ok) throw new Error("Failed to vote");

      const updatedPhoto = await response.json();
      
      setPhotos((prev) =>
        prev.map((photo) =>
          photo.id === photoId ? updatedPhoto : photo
        )
      );
    } catch (err) {
      console.error("Error voting:", err);
      setError(err instanceof Error ? err.message : "Failed to vote");
    }
  };

  return (
    <main className="mx-auto max-w-7xl p-6">
      <h1 className="text-2xl font-semibold mb-4">Browse Photos</h1>
      
      <ContestSelector
        contests={contests}
        contestId={contestId}
        loadingContests={loadingContests}
        onChange={setContestId}
      />

      {error && (
        <p className="mt-3 text-sm text-red-600">{error}</p>
      )}

      {loadingPhotos ? (
        <div className="mt-8 text-center text-muted-foreground">
          Loading photos...
        </div>
      ) : photos.length === 0 ? (
        <div className="mt-8 text-center text-muted-foreground">
          No photos submitted yet for this contest.
        </div>
      ) : (
        <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {photos.map((photo) => (
            <ImageCard
              key={photo.id}
              photo={photo}
              onVote={handleVote}
            />
          ))}
        </div>
      )}
    </main>
  );
}
