import Image from "next/image";

export default function Home() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-zinc-50 to-zinc-100 font-sans dark:from-black dark:to-zinc-950">
      <main className="flex min-h-screen w-full max-w-4xl flex-col items-center justify-between py-20 px-6 sm:px-16">
        <div className="flex-1 flex flex-col items-center justify-center gap-12 text-center">
          <div className="flex flex-col gap-4">
            <h1 className="text-5xl sm:text-6xl font-bold tracking-tight text-black dark:text-white">
              Prized Pic
            </h1>
            <p className="text-xl text-zinc-600 dark:text-zinc-300">
              Discover, upload, and celebrate the best photos
            </p>
          </div>

          <p className="max-w-2xl text-lg leading-8 text-zinc-600 dark:text-zinc-400">
            Share your finest moments with a community of photographers. Upload
            your work, get feedback, and vote on the pictures that inspire you.
          </p>

          <div className="flex flex-col gap-4 w-full sm:flex-row sm:justify-center pt-4">
            <a
              className="flex h-14 items-center justify-center rounded-lg bg-black px-8 text-white font-semibold transition-colors hover:bg-zinc-800 dark:bg-white dark:text-black dark:hover:bg-zinc-200"
              href="/submit"
            >
              Upload Photo
            </a>
            <a
              className="flex h-14 items-center justify-center rounded-lg border-2 border-black px-8 font-semibold transition-colors hover:bg-black hover:text-white dark:border-white dark:hover:bg-white dark:hover:text-black"
              href="/browse"
            >
              Vote & Browse
            </a>
          </div>
        </div>

        <footer className="text-sm text-zinc-500 dark:text-zinc-400 pt-8">
          © 2024 Prized Pic. All rights reserved.
        </footer>
      </main>
    </div>
  );
}
