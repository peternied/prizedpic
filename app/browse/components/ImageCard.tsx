"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { Info, X } from "lucide-react";
import { VoteButtonsContainer, VoteType, PhotoVoteState } from "./VoteButtons";


type Photo = PhotoVoteState & {
    publicId: string;
    secureUrl: string;
    title: string | null;
    submittedAt: Date;
    submitterEmail: string | null;
    submitterId: string | null;
};

type ImageCardProps = {
    photo: Photo;
    contestId: string;
    userId: string;
    contestClosed?: boolean;
};

export function ImageCard({ photo, contestId, userId, contestClosed = false }: ImageCardProps) {
    const [photoState, setPhotoState] = useState(photo);
    const [voting, setVoting] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [showDetails, setShowDetails] = useState(false);
    const [showPhotoViewer, setShowPhotoViewer] = useState(false);

    const handleVote = async (voteType: VoteType) => {
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

            if (response.status === 404) throw new Error("Photo not found");
            if (response.status === 403) throw new Error("You are not allowed to vote");
            if (!response.ok) throw new Error("Failed to vote");

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

    // Generate thumbnail URL with Cloudinary transformations
    const generateThumbnailUrl = (secureUrl: string) => {
        return secureUrl.replace(
            '/upload/',
            '/upload/w_500,h_500,c_fill,q_auto,f_auto/'
        );
    };

    const thumbnailUrl = generateThumbnailUrl(photoState.secureUrl);

    const fullImageUrl = photoState.secureUrl.replace('/upload/', '/upload/q_auto,f_auto/');

    useEffect(() => {
        if (!showPhotoViewer) {
            return;
        }

        const originalOverflow = document.body.style.overflow;
        document.body.style.overflow = "hidden";

        const onEscape = (event: KeyboardEvent) => {
            if (event.key === "Escape") {
                setShowPhotoViewer(false);
            }
        };

        window.addEventListener("keydown", onEscape);

        return () => {
            window.removeEventListener("keydown", onEscape);
            document.body.style.overflow = originalOverflow;
        };
    }, [showPhotoViewer]);

    return (
        <div className="rounded-lg border bg-card overflow-hidden shadow-sm hover:shadow-md transition-shadow relative">
            <div className="relative">
                <button
                    type="button"
                    onClick={() => setShowPhotoViewer(true)}
                    className="w-full"
                >
                    <Image
                        src={thumbnailUrl}
                        alt={photoState.title || "Contest photo"}
                        width={500}
                        height={500}
                        className="w-full aspect-square object-cover cursor-pointer hover:opacity-90 transition-opacity"
                        loading="lazy"
                    />
                </button>
            </div>

            <div className="p-4">
                <div className="h-12 mb-3">
                    <h3 className="font-medium text-sm line-clamp-2">
                        {photoState.title || "\u00A0"}
                    </h3>
                </div>

                {error && <p className="text-xs text-red-600 mb-2">{error}</p>}

                <div className="flex gap-3 justify-center items-center">
                    <VoteButtonsContainer
                        photoState={photoState}
                        voting={voting}
                        onVote={handleVote}
                        contestClosed={contestClosed}
                    />

                    <div className="relative">
                        <button
                            onClick={() => setShowDetails(!showDetails)}
                            className="p-2 rounded-lg bg-white/70 hover:bg-white border border-gray-200 shadow-sm transition-colors"
                            type="button"
                            title="View uploader details"
                        >
                            <Info className="w-5 h-5 text-gray-600" />
                        </button>
                        
                        {showDetails && (
                            <div className="absolute bottom-full right-0 mb-2 p-3 bg-white border border-gray-200 rounded-lg shadow-lg text-xs whitespace-nowrap z-10 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-gray-300">
                                <div className="font-medium text-gray-900 mb-1">Uploader</div>
                                <div className="text-gray-600">ID: {photoState.submitterId}</div>
                                <div className="text-gray-600">{photoState.submitterEmail}</div>
                                <div className="text-gray-500 mt-2 pt-2 border-t border-gray-100">
                                    {new Date(photoState.submittedAt).toLocaleString()}
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {showPhotoViewer && (
                <div className="fixed inset-0 z-50 bg-black/95 flex flex-col items-center justify-center p-4">
                    <button
                        onClick={() => setShowPhotoViewer(false)}
                        className="absolute z-10 top-4 right-4 p-2 rounded-lg bg-white/10 hover:bg-white/20 border border-white/20 transition-colors"
                        type="button"
                        title="Close"
                    >
                        <X className="w-6 h-6 text-white" />
                    </button>

                    <div className="relative w-full h-full flex items-center justify-center">
                        <Image
                            src={fullImageUrl}
                            alt={photoState.title || "Contest photo"}
                            fill
                            sizes="100vw"
                            className="object-contain object-center"
                            priority
                        />
                    </div>

                    <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-6 text-white">
                        <div className="max-w-4xl mx-auto">
                            <h2 className="text-xl font-semibold mb-3">
                                {photoState.title || "Untitled"}
                            </h2>

                            <div className="flex gap-3 items-center mb-3">
                                <VoteButtonsContainer
                                    photoState={photoState}
                                    voting={voting}
                                    onVote={handleVote}
                                    variant="dark"
                                    contestClosed={contestClosed}
                                />
                            </div>

                            <div className="text-xs text-white/60">
                                <div>Uploaded by: {photoState.submitterEmail || "Anonymous"}</div>
                                <div>{new Date(photoState.submittedAt).toLocaleString()}</div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
