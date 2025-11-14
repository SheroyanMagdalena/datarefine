"use client";

import Link from "next/link";
import { SignInButton, SignedIn, SignedOut, UserButton } from "@clerk/nextjs";

export default function Header() {
  return (
    <header className="sticky top-0 z-50 border-b border-slate-800/80 bg-slate-950/80 backdrop-blur">
      <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">

        {/* Brand */}
        <Link
          href="/"
          aria-label="DataRefine Home"
          className="inline-flex items-baseline gap-1.5 select-none"
        >
          <span className="text-xl font-extrabold bg-gradient-to-r from-sky-400 to-sky-300 bg-clip-text text-transparent tracking-tight">
            Data
          </span>
          <span className="text-xl font-semibold bg-gradient-to-r from-sky-300 to-indigo-200 bg-clip-text text-transparent tracking-tight">
            Refine
          </span>
        </Link>

        {/* Nav */}
        <nav className="flex items-center gap-4 sm:gap-6 text-sm">
          <Link
            href="/"
            className="text-slate-200/90 hover:text-sky-400 transition-colors"
          >
            Home
          </Link>

          <Link
            href="/about"
            className="text-slate-200/90 hover:text-sky-400 transition-colors hidden sm:inline-block"
          >
            About
          </Link>

          {/* Show "Projects" only if user is signed in */}
          <SignedIn>
            <Link
              href="/project"
              className="text-slate-200/90 hover:text-sky-400 transition-colors"
            >
              Projects
            </Link>
          </SignedIn>

          {/* User menu */}
          <SignedIn>
            <div className="ml-2">
              <UserButton
                appearance={{
                  variables: { colorPrimary: "#38bdf8" },
                }}
              />
            </div>
          </SignedIn>

          {/* Sign in button for logged-out users */}
          <SignedOut>
            <SignInButton mode="modal">
              <button className="ml-1 rounded-xl border border-slate-600/70 bg-gradient-to-r from-sky-500 to-blue-500 px-4 py-1.5 text-xs sm:text-sm font-medium text-white shadow-md shadow-sky-500/30 hover:from-sky-400 hover:to-blue-500 transition">
                Sign In
              </button>
            </SignInButton>
          </SignedOut>
        </nav>
      </div>
    </header>
  );
}