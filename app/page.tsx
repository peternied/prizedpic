import { Trophy, Medal, PartyPopper, Sparkles } from "lucide-react";
import Link from 'next/link';

export default function Home() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-zinc-50 to-zinc-100 font-sans dark:from-black dark:to-zinc-950">
      <main className="flex min-h-screen w-full max-w-4xl flex-col items-center justify-between py-20 px-6 sm:px-16">
        <div className="flex-1 flex flex-col items-center justify-center gap-12 text-center">
          
          {/* What's New Section */}
          <div className="w-full max-w-2xl rounded-2xl border-2 border-blue-200 bg-gradient-to-br from-blue-50 to-purple-50 p-6 shadow-lg dark:border-blue-800 dark:from-blue-950/50 dark:to-purple-950/50">
            <div className="flex items-center justify-center gap-2 mb-4">
              <Sparkles className="w-6 h-6 text-blue-600 dark:text-blue-400" />
              <h2 className="text-2xl font-bold text-blue-900 dark:text-blue-200">
                What&apos;s New
              </h2>
              <Sparkles className="w-6 h-6 text-blue-600 dark:text-blue-400" />
            </div>
            <div className="space-y-3 text-left">
              <div className="flex items-start gap-3">
                <span className="text-lg">✨</span>
                <p className="text-sm text-zinc-700 dark:text-zinc-300">
                  <strong>Enhanced voting buttons</strong> - Cleaner design with improved visual feedback and colored backgrounds when voted
                </p>
              </div>
              <div className="flex items-start gap-3">
                <span className="text-lg">🎨</span>
                <p className="text-sm text-zinc-700 dark:text-zinc-300">
                  <strong>Better UX on browse page</strong> - Added loading spinner and smoother interactions
                </p>
              </div>
            </div>
          </div>
          <div className="flex flex-col gap-4">
            <h1 className="text-5xl sm:text-6xl font-bold tracking-tight text-black dark:text-white">
              Prized Pic
            </h1>
            <p className="text-xl text-zinc-600 dark:text-zinc-300">
              Discover, upload, and celebrate the best photos
            </p>
          </div>

          <div className="flex flex-col items-center gap-3">
            <span className="inline-flex items-center rounded-full bg-gradient-to-r from-blue-600 to-purple-600 px-4 py-1.5 text-sm font-bold text-white shadow-lg animate-pulse">
              Special for AIRFAM! 🎉
            </span>
            <p className="max-w-2xl text-lg leading-8 text-zinc-600 dark:text-zinc-400">
              Share your finest moments with a community of photographers. Upload
              your work, get feedback, and vote on the pictures that inspire you.
            </p>
          </div>

          <div className="flex flex-col gap-4 w-full sm:flex-row sm:justify-center pt-4">
            <Link href="/submit" className="flex h-14 items-center justify-center rounded-lg bg-black px-8 text-white font-semibold transition-colors hover:bg-zinc-800 dark:bg-white dark:text-black dark:hover:bg-zinc-200">
              Upload Photo
            </Link>
            <Link href="/browse/" className="inline-block bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-blue-50 transition-colors">
              Browse Gallery
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 pt-12 w-full max-w-2xl">
            <div className="flex flex-col items-center gap-3">
              <Trophy className="w-8 h-8 text-blue-600" strokeWidth={2} />
              <div className="font-semibold text-black dark:text-white">
                Overall
              </div>
              <p className="text-sm text-zinc-600 dark:text-zinc-400">
                Rate the overall quality and impact
              </p>
            </div>
            <div className="flex flex-col items-center gap-3">
              <Medal className="w-8 h-8 text-purple-600" strokeWidth={2} />
              <div className="font-semibold text-black dark:text-white">
                Technical
              </div>
              <p className="text-sm text-zinc-600 dark:text-zinc-400">
                Recognize technical excellence
              </p>
            </div>
            <div className="flex flex-col items-center gap-3">
              <PartyPopper className="w-8 h-8 text-amber-600" strokeWidth={2} />
              <div className="font-semibold text-black dark:text-white">
                Funny
              </div>
              <p className="text-sm text-zinc-600 dark:text-zinc-400">
                Celebrate humor and creativity
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
