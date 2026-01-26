type ContestListItem = {
  id: string;
  name: string;
  description: string | null;
  createdAt: Date;
  submissionsClosedAt: Date | null;
  endsAt: Date | null;
};

type ContestSelectorProps = {
  contests: ContestListItem[];
  contestId: string;
  loadingContests: boolean;
  onChange: (contestId: string) => void;
};

export function ContestSelector({
  contests,
  contestId,
  loadingContests,
  onChange,
}: ContestSelectorProps) {
  const selectedContest = contests.find((c) => c.id === contestId);
  const isClosed =
    selectedContest?.submissionsClosedAt &&
    new Date(selectedContest.submissionsClosedAt) < new Date();

  const getTimeRemaining = (date: Date | null | undefined) => {
    if (!date) return null;
    const now = new Date();
    const target = new Date(date);
    const diff = target.getTime() - now.getTime();

    if (diff <= 0) return "Closed";

    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));

    if (days > 0) return `${days}d ${hours}h`;
    if (hours > 0) return `${hours}h ${minutes}m`;
    return `${minutes}m`;
  };

  return (
    <div>
      <label className="block text-sm font-medium">Contest</label>
      <select
        className="w-full rounded-md border px-3 py-2 mt-1"
        value={contestId}
        onChange={(e) => onChange(e.target.value)}
        disabled={loadingContests || contests.length === 0}
      >
        {contests.map((c) => (
          <option key={c.id} value={c.id}>
            {c.name}
          </option>
        ))}
      </select>

      {selectedContest && (
        <div className="mt-3 p-3 rounded-md border bg-gray-50">
          <p className="text-sm font-medium">{selectedContest.name}</p>
          {selectedContest.description && (
            <p className="text-xs text-gray-600 mt-2">{selectedContest.description}</p>
          )}
          <div className="mt-3 space-y-1">
            {selectedContest.submissionsClosedAt && (
              <p
                className={`text-xs font-medium ${
                  isClosed ? "text-red-600" : "text-green-600"
                }`}
              >
                {isClosed
                  ? "❌ Submissions closed"
                  : `✓ Submissions close in ${getTimeRemaining(selectedContest.submissionsClosedAt)}`}
              </p>
            )}
            {selectedContest.endsAt && (
              <p className="text-xs text-gray-600">
                Voting closes in {getTimeRemaining(selectedContest.endsAt)}
              </p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
