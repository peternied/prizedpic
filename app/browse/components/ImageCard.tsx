"use client";

import { useState } from "react";
import { Trophy, Medal, PartyPopper, Info } from "lucide-react";


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

type ImageCardProps = {
    photo: Photo;
    contestId: string;
    userId: string;
};

export function ImageCard({ photo, contestId, userId }: ImageCardProps) {
    const [photoState, setPhotoState] = useState(photo);
    const [voting, setVoting] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [showDetails, setShowDetails] = useState(false);

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

    const VoteIcon = ({
        type,
        voted,
    }: {
        type: "OVERALL" | "TECHNICAL" | "FUNNY";
        voted: boolean;
    }) => {
        const className = `w-5 h-5 ${voted ? "opacity-100" : "opacity-70"}`;

        switch (type) {
            case "OVERALL":
                return <Trophy className={className} strokeWidth={2} aria-hidden="true" />;
            case "TECHNICAL":
                return <Medal className={className} strokeWidth={2} aria-hidden="true" />;
            case "FUNNY":
                return <PartyPopper className={className} strokeWidth={2} aria-hidden="true" />;
        }
    };

    const VoteButton = ({
        type,
        voted,
        count,
        color,       // e.g. "blue" | "purple" | "amber"
        iconTitle,
        onClick,
        disabled,
    }: {
        type: "OVERALL" | "TECHNICAL" | "FUNNY";
        voted: boolean;
        count: number;
        color: "blue" | "purple" | "amber";
        iconTitle: string;
        onClick: () => void;
        disabled: boolean;
    }) => {
        const active = voted && !disabled;

        const colorClasses: Record<typeof color, { text: string; ring: string; shadow: string }> = {
            blue: {
                text: "text-blue-600",
                bg: "bg-blue-50",
                border: "border-blue-200",
                hover: "hover:bg-blue-100 hover:border-blue-300",
                ring: "ring-blue-300",
            },
            purple: {
                text: "text-purple-600",
                bg: "bg-purple-50",
                border: "border-purple-200",
                hover: "hover:bg-purple-100 hover:border-purple-300",
                ring: "ring-purple-300",
            },
            amber: {
                text: "text-amber-600",
                bg: "bg-amber-50",
                border: "border-amber-200",
                hover: "hover:bg-amber-100 hover:border-amber-300",
                ring: "ring-amber-300",
            },
        };

        const c = colorClasses[color];

        return (
            <button
                onClick={onClick}
                disabled={disabled}
                type="button"
                title={iconTitle}
                className={[
                    // base
                    "group flex items-center gap-2 px-3 py-2.5 rounded-lg border transition font-medium",
                    "cursor-pointer",
                    "disabled:opacity-50 disabled:cursor-not-allowed",

                    // focus
                    "focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-gray-300",

                    // inactive state
                    !active ? [
                        "bg-white border-gray-200 text-gray-600",
                        "hover:bg-gray-50 hover:border-gray-300",
                    ].join(" ") : "",

                    // active state (voted)
                    active
                        ? [
                            c.text,
                            c.bg,
                            c.border,
                            c.hover,
                            "ring-1",
                            c.ring,
                            "shadow-sm",
                        ].join(" ")
                        : "",
                ].join(" ")}
            >
                <span className={active ? c.text : "text-gray-500"}>
                    <VoteIcon type={type} voted={voted} />
                </span>

                <span className={`text-sm font-semibold tabular-nums ${active ? c.text : "text-gray-500"}`}>
                    {count}
                </span>
            </button>
        );
    };


    return (
        <div className="rounded-lg border bg-card overflow-hidden shadow-sm hover:shadow-md transition-shadow relative">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
                src={photoState.secureUrl}
                alt={photoState.title || "Contest photo"}
                className="w-full aspect-square object-cover"
            />

            <div className="p-4">
                <div className="h-12 mb-3">
                    <h3 className="font-medium text-sm line-clamp-2">
                        {photoState.title || "\u00A0"}
                    </h3>
                </div>

                {error && <p className="text-xs text-red-600 mb-2">{error}</p>}

                <div className="flex gap-3 justify-center items-center">
                    <VoteButton
                        type="OVERALL"
                        voted={photoState.userVoteTypes.OVERALL}
                        count={photoState.totalVotes.OVERALL}
                        color="blue"
                        iconTitle="Overall"
                        onClick={() => handleVote("OVERALL")}
                        disabled={voting}
                    />

                    <VoteButton
                        type="TECHNICAL"
                        voted={photoState.userVoteTypes.TECHNICAL}
                        count={photoState.totalVotes.TECHNICAL}
                        color="purple"
                        iconTitle="Technical"
                        onClick={() => handleVote("TECHNICAL")}
                        disabled={voting}
                    />

                    <VoteButton
                        type="FUNNY"
                        voted={photoState.userVoteTypes.FUNNY}
                        count={photoState.totalVotes.FUNNY}
                        color="amber"
                        iconTitle="Funny"
                        onClick={() => handleVote("FUNNY")}
                        disabled={voting}
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
                            <div className="absolute bottom-full right-0 mb-2 p-3 bg-white border border-gray-200 rounded-lg shadow-lg text-xs whitespace-nowrap z-10">
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
        </div>
    );
}
