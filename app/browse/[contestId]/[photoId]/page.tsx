"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { X } from "lucide-react";
import { useRouter } from "next/navigation";
import { getUserId } from "@/lib/userIdGenerator";
import { getPhotoVotes, getContestInfo } from "@/app/actions";
import { VoteButtonsContainer, VoteType, PhotoVoteState } from "@/app/browse/components/VoteButtons";

type Photo = PhotoVoteState & {
    publicId: string;
    secureUrl: string;
    title: string | null;
    submittedAt: Date;
    submitterEmail: string | null;
    submitterId: string | null;
};

type ContestInfo = {
    id: string;
    name: string;
    endsAt: Date | null;
    isClosed: boolean;
};

export default function PhotoPage({
    params,
}: {
    params: Promise<{ contestId: string; photoId: string }>;
}) {
    const [photo, setPhoto] = useState<Photo | null>(null);
    const [contestInfo, setContestInfo] = useState<ContestInfo | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [voting, setVoting] = useState(false);
    const [userId, setUserId] = useState("");
    const router = useRouter();

    useEffect(() => {
        const userId = getUserId();
        setUserId(userId);
    }, []);

    useEffect(() => {
        const fetchPhoto = async () => {
            try {
                const { photoId, contestId } = await params;
                const photoData = await getPhotoVotes(photoId, userId);
                const contestData = await getContestInfo(contestId);
                setPhoto(photoData);
                setContestInfo(contestData);
            } catch (err) {
                const errorMsg = err instanceof Error ? err.message : "Failed to load photo";
                setError(errorMsg);
                console.error("Error loading photo:", err);
            } finally {
                setLoading(false);
            }
        };

        if (userId) {
            fetchPhoto();
        }
    }, [userId, params]);

    const handleVote = async (voteType: VoteType) => {
        if (!photo) return;
        setVoting(true);
        try {
            const { contestId } = await params;
            const response = await fetch("/api/votes", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    photoId: photo.id,
                    voteType,
                    contestId,
                    userId,
                }),
            });

            if (!response.ok) throw new Error("Failed to vote");
            const updatedPhoto = await response.json();
            setPhoto(updatedPhoto);
        } catch (err) {
            const errorMsg = err instanceof Error ? err.message : "Failed to vote";
            console.error("Error voting:", err);
            setError(errorMsg);
        } finally {
            setVoting(false);
        }
    };

    const generateFullImageUrl = (secureUrl: string | undefined) => {
        if (!secureUrl) return "";
        return secureUrl.replace("/upload/", "/upload/q_auto,f_auto/");
    };

    if (loading) {
        return (
            <div className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center">
                <div className="animate-spin">
                    <div className="w-12 h-12 border-4 border-white/20 border-t-white rounded-full" />
                </div>
            </div>
        );
    }

    if (error || !photo) {
        return (
            <div className="fixed inset-0 z-50 bg-black/95 flex flex-col items-center justify-center gap-4">
                <p className="text-white text-center">{error || "Photo not found"}</p>
                <button
                    onClick={() => router.back()}
                    className="px-4 py-2 bg-white/10 hover:bg-white/20 border border-white/20 rounded-lg text-white transition-colors"
                >
                    Go Back
                </button>
            </div>
        );
    }

    const fullImageUrl = generateFullImageUrl(photo.secureUrl);

    return (
        <div className="fixed inset-0 z-50 bg-black/95 flex flex-col items-center justify-center p-4">
            <button
                onClick={() => router.back()}
                className="absolute top-4 right-4 p-2 rounded-lg bg-white/10 hover:bg-white/20 border border-white/20 transition-colors"
                type="button"
                title="Close"
            >
                <X className="w-6 h-6 text-white" />
            </button>

            <div className="relative w-full h-full flex items-center justify-center">
                <Image
                    src={fullImageUrl}
                    alt={photo.title || "Contest photo"}
                    fill
                    sizes="100vw"
                    className="object-contain object-center"
                    priority
                />
            </div>

            {/* Bottom Info Bar */}
            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-6 text-white">
                <div className="max-w-4xl mx-auto">
                    <h2 className="text-xl font-semibold mb-3">
                        {photo.title || "Untitled"}
                    </h2>

                    <div className="flex gap-3 items-center mb-3">
                        <VoteButtonsContainer
                            photoState={photo}
                            voting={voting}
                            onVote={handleVote}
                            variant="dark"
                            contestClosed={contestInfo?.isClosed ?? false}
                        />
                    </div>

                    <div className="text-xs text-white/60">
                        <div>Uploaded by: {photo.submitterEmail || "Anonymous"}</div>
                        <div>
                            {new Date(photo.submittedAt).toLocaleString()}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
