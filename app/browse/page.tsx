"use client";

import { useState, useEffect } from "react";
import { loadContests, loadContestPhotosWithVotes, getContestInfo } from "@/app/actions";
import { ContestSelector } from "@/app/submit/components/ContestSelector";
import { ImageCard } from "./components/ImageCard";
import { getUserId } from "@/lib/userIdGenerator";

type Photo = {
    id: string;
    publicId: string;
    secureUrl: string;
    title: string | null;
    submittedAt: Date;
    submitterEmail: string | null;
    submitterId: string | null;
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

type ContestInfo = {
    id: string;
    name: string;
    endsAt: Date | null;
    isClosed: boolean;
};

export default function BrowsePage() {
  const [contests, setContests] = useState<ContestListItem[]>([]);
  const [contestId, setContestId] = useState("");
  const [loadingContests, setLoadingContests] = useState(false);
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [contestInfo, setContestInfo] = useState<ContestInfo | null>(null);
  const [loadingPhotos, setLoadingPhotos] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [userId, setUserId] = useState("");

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
    setUserId(getUserId());
  }, []);

  useEffect(() => {
    if (!contestId || !userId) return;

    const fetchPhotosAndContest = async () => {
      setLoadingPhotos(true);
      setError(null);
      try {
        // Fetch photos and contest info in parallel
        const [photosData, infoData] = await Promise.all([
          loadContestPhotosWithVotes(contestId, userId),
          getContestInfo(contestId),
        ]);
        setPhotos(photosData);
        setContestInfo(infoData);
      } catch (err) {
        console.error("Error loading photos:", err);
        setError(err instanceof Error ? err.message : "Failed to load photos");
      } finally {
        setLoadingPhotos(false);
      }
    };

    fetchPhotosAndContest();
  }, [contestId, userId]);

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

      {loadingContests ? (
        <div className="mt-8 flex justify-center items-center py-12">
          <div className="flex flex-col items-center gap-4">
            <div className="w-12 h-12 border-4 border-gray-300 border-t-gray-900 rounded-full animate-spin"></div>
            <p className="text-muted-foreground">Loading contests...</p>
          </div>
        </div>
      ) : loadingPhotos ? (
        <div className="mt-8 flex justify-center items-center py-12">
          <div className="flex flex-col items-center gap-4">
            <div className="w-12 h-12 border-4 border-gray-300 border-t-gray-900 rounded-full animate-spin"></div>
            <p className="text-muted-foreground">Loading photos...</p>
          </div>
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
              contestId={contestId}
              userId={userId}
              contestClosed={contestInfo?.isClosed ?? false}
            />
          ))}
        </div>
      )}
    </main>
  );
}
