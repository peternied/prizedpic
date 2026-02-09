"use client";

import { Trophy, Medal, PartyPopper } from "lucide-react";

export type VoteType = "OVERALL" | "TECHNICAL" | "FUNNY";

export type PhotoVoteState = {
    id: string;
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

type VoteButtonColor = "blue" | "purple" | "amber";

interface VoteIconProps {
    type: VoteType;
    voted: boolean;
}

export function VoteIcon({ type, voted }: VoteIconProps) {
    const className = `w-5 h-5 ${voted ? "opacity-100" : "opacity-70"}`;

    switch (type) {
        case "OVERALL":
            return <Trophy className={className} strokeWidth={2} aria-hidden="true" />;
        case "TECHNICAL":
            return <Medal className={className} strokeWidth={2} aria-hidden="true" />;
        case "FUNNY":
            return <PartyPopper className={className} strokeWidth={2} aria-hidden="true" />;
    }
}

interface SingleVoteButtonProps {
    type: VoteType;
    voted: boolean;
    count: number;
    color: VoteButtonColor;
    iconTitle: string;
    onClick: () => void;
    disabled: boolean;
    variant?: "light" | "dark";
}

export function VoteButton({
    type,
    voted,
    count,
    color,
    iconTitle,
    onClick,
    disabled,
    variant = "light",
}: SingleVoteButtonProps) {
    const active = voted && !disabled;

    if (variant === "dark") {
        const darkColorMap: Record<VoteButtonColor, string> = {
            blue: "bg-blue-600/30 border-blue-400 text-blue-100",
            purple: "bg-purple-600/30 border-purple-400 text-purple-100",
            amber: "bg-amber-600/30 border-amber-400 text-amber-100",
        };

        return (
            <button
                onClick={onClick}
                disabled={disabled}
                type="button"
                title={iconTitle}
                className={`flex items-center gap-2 px-3 py-2 rounded-lg border transition ${
                    active ? darkColorMap[color] : "bg-white/10 border-white/20 text-white/70 hover:bg-white/20"
                } disabled:opacity-50`}
            >
                <VoteIcon type={type} voted={voted} />
                <span className="text-sm font-semibold">{count}</span>
            </button>
        );
    }

    const colorClasses: Record<
        VoteButtonColor,
        { text: string; bg: string; border: string; hover: string; ring: string }
    > = {
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
                !active
                    ? [
                          "bg-white border-gray-200 text-gray-600",
                          "hover:bg-gray-50 hover:border-gray-300",
                      ].join(" ")
                    : "",

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
}

interface VoteButtonsContainerProps {
    photoState: PhotoVoteState;
    voting: boolean;
    onVote: (voteType: VoteType) => void;
    variant?: "light" | "dark";
    contestClosed?: boolean;
}

export function VoteButtonsContainer({
    photoState,
    voting,
    onVote,
    variant = "light",
    contestClosed = false,
}: VoteButtonsContainerProps) {
    return (
        <div className="flex gap-3 justify-center items-center">
            <VoteButton
                type="OVERALL"
                voted={photoState.userVoteTypes.OVERALL}
                count={photoState.totalVotes.OVERALL}
                color="blue"
                iconTitle="Overall"
                onClick={() => onVote("OVERALL")}
                disabled={voting || contestClosed}
                variant={variant}
            />

            <VoteButton
                type="TECHNICAL"
                voted={photoState.userVoteTypes.TECHNICAL}
                count={photoState.totalVotes.TECHNICAL}
                color="purple"
                iconTitle="Technical"
                onClick={() => onVote("TECHNICAL")}
                disabled={voting || contestClosed}
                variant={variant}
            />

            <VoteButton
                type="FUNNY"
                voted={photoState.userVoteTypes.FUNNY}
                count={photoState.totalVotes.FUNNY}
                color="amber"
                iconTitle="Funny"
                onClick={() => onVote("FUNNY")}
                disabled={voting || contestClosed}
                variant={variant}
            />
        </div>
    );
}
