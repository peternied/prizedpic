"use client";

import { useState } from "react";

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

type ImageCardProps = {
  photo: Photo;
  contestId: string;
  userId: string;
};

export function ImageCard({ photo, contestId, userId }: ImageCardProps) {
  const [photoState, setPhotoState] = useState(photo);
  const [voting, setVoting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleVote = async (voteType: "OVERALL" | "TECHNICAL" | "FUNNY") => {
    setVoting(true);
    setError(null);
    try {
      const response = await fetch("/api/votes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          photoId: photoState.id,
          voteType,
          contestId,
          userId,
        }),
      });

      if (response.status === 404) {
        throw new Error("Photo not found");
      } else if (response.status === 403) {
        throw new Error("You are not allowed to vote");
      } else if (!response.ok) {
        throw new Error("Failed to vote");
      }

      const updatedPhoto = await response.json();
      setPhotoState(updatedPhoto);
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : "Failed to vote";
      console.error("Error voting:", err);
      setError(errorMsg);
    } finally {
      setVoting(false);
    }
  };

  const VoteIcon = ({ type, voted }: { type: "OVERALL" | "TECHNICAL" | "FUNNY"; voted: boolean }) => {
    const iconClass = `w-5 h-5 ${voted ? "fill-current" : ""}`;
    
    switch (type) {
      case "OVERALL":
        return (
          <svg className={iconClass} viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8zm3.5-9c.83 0 1.5-.67 1.5-1.5S16.33 8 15.5 8 14 8.67 14 9.5s.67 1.5 1.5 1.5zm-7 0c.83 0 1.5-.67 1.5-1.5S9.33 8 8.5 8 7 8.67 7 9.5 7.67 11 8.5 11zm3.5 6.5c2.33 0 4.31-1.46 5.11-3.5H6.89c.8 2.04 2.78 3.5 5.11 3.5z" />
          </svg>
        );
      case "TECHNICAL":
        return (
          <svg className={iconClass} viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path d="M9 17H7v-7h2V17zm4 0h-2V7h2v10zm4-7v7h-2v-4h-2v4h-2V7h6z" />
          </svg>
        );
      case "FUNNY":
        return (
          <svg className={iconClass} viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8zm0-13c-2.76 0-5 2.24-5 5h2c0-1.66 1.34-3 3-3s3 1.34 3 3h2c0-2.76-2.24-5-5-5zm0 9c-1.66 0-3 1.34-3 3h2c0-.55.45-1 1-1s1 .45 1 1h2c0-1.66-1.34-3-3-3z" />
          </svg>
        );
    }
  };

  const handleVoteClick = (voteType: "OVERALL" | "TECHNICAL" | "FUNNY") => {
    handleVote(voteType);
  };

  return (
    <div className="rounded-lg border bg-card overflow-hidden shadow-sm hover:shadow-md transition-shadow">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={photoState.secureUrl}
        alt={photoState.title || "Contest photo"}
        className="w-full aspect-square object-cover"
      />
      
      <div className="p-4">
        {photoState.title && (
          <h3 className="font-medium text-sm mb-3 line-clamp-2">
            {photoState.title}
          </h3>
        )}

        {error && (
          <p className="text-xs text-red-600 mb-2">{error}</p>
        )}
        
        <div className="flex gap-3 justify-center items-center">
          <button
            onClick={() => handleVoteClick("OVERALL")}
            disabled={voting}
            className={`p-2 rounded-lg transition-colors disabled:opacity-50 ${
              photoState.userVoteTypes.OVERALL
                ? "bg-blue-100 text-blue-600"
                : "bg-gray-100 text-gray-400 hover:text-gray-600"
            }`}
            type="button"
            title="Overall"
          >
            <VoteIcon type="OVERALL" voted={photoState.userVoteTypes.OVERALL} />
          </button>
          
          <button
            onClick={() => handleVoteClick("TECHNICAL")}
            disabled={voting}
            className={`p-2 rounded-lg transition-colors disabled:opacity-50 ${
              photoState.userVoteTypes.TECHNICAL
                ? "bg-purple-100 text-purple-600"
                : "bg-gray-100 text-gray-400 hover:text-gray-600"
            }`}
            type="button"
            title="Technical"
          >
            <VoteIcon type="TECHNICAL" voted={photoState.userVoteTypes.TECHNICAL} />
          </button>
          
          <button
            onClick={() => handleVoteClick("FUNNY")}
            disabled={voting}
            className={`p-2 rounded-lg transition-colors disabled:opacity-50 ${
              photoState.userVoteTypes.FUNNY
                ? "bg-yellow-100 text-yellow-600"
                : "bg-gray-100 text-gray-400 hover:text-gray-600"
            }`}
            type="button"
            title="Funny"
          >
            <VoteIcon type="FUNNY" voted={photoState.userVoteTypes.FUNNY} />
          </button>
        </div>

        {Object.values(photoState.totalVotes).some(v => v > 0) && (
          <div className="mt-3 text-xs text-gray-600 text-center space-y-1">
            {photoState.totalVotes.OVERALL > 0 && <div>👍 {photoState.totalVotes.OVERALL}</div>}
            {photoState.totalVotes.TECHNICAL > 0 && <div>⚙️ {photoState.totalVotes.TECHNICAL}</div>}
            {photoState.totalVotes.FUNNY > 0 && <div>😄 {photoState.totalVotes.FUNNY}</div>}
          </div>
        )}
      </div>
    </div>
  );
}
