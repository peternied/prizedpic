"use client";

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
  onVote: (photoId: string, voteType: "OVERALL" | "TECHNICAL" | "FUNNY") => void;
};

export function ImageCard({ photo, onVote }: ImageCardProps) {
  return (
    <div className="rounded-lg border bg-card overflow-hidden shadow-sm hover:shadow-md transition-shadow">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={photo.secureUrl}
        alt={photo.title || "Contest photo"}
        className="w-full aspect-square object-cover"
      />
      
      <div className="p-4">
        {photo.title && (
          <h3 className="font-medium text-sm mb-3 line-clamp-2">
            {photo.title}
          </h3>
        )}
        
        <div className="space-y-2">
          <button
            onClick={() => onVote(photo.id, "OVERALL")}
            className={`w-full flex items-center justify-between px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
              photo.userVoteTypes.OVERALL
                ? "bg-blue-100 text-blue-700"
                : "bg-gray-100 hover:bg-gray-200 text-gray-700"
            }`}
            type="button"
          >
            <span>Overall</span>
            <span>{photo.totalVotes.OVERALL}</span>
          </button>
          
          <button
            onClick={() => onVote(photo.id, "TECHNICAL")}
            className={`w-full flex items-center justify-between px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
              photo.userVoteTypes.TECHNICAL
                ? "bg-purple-100 text-purple-700"
                : "bg-gray-100 hover:bg-gray-200 text-gray-700"
            }`}
            type="button"
          >
            <span>Technical</span>
            <span>{photo.totalVotes.TECHNICAL}</span>
          </button>
          
          <button
            onClick={() => onVote(photo.id, "FUNNY")}
            className={`w-full flex items-center justify-between px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
              photo.userVoteTypes.FUNNY
                ? "bg-yellow-100 text-yellow-700"
                : "bg-gray-100 hover:bg-gray-200 text-gray-700"
            }`}
            type="button"
          >
            <span>Funny</span>
            <span>{photo.totalVotes.FUNNY}</span>
          </button>
        </div>
      </div>
    </div>
  );
}
