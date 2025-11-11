"use client";

import Link from "next/link";
import { SignInButton, SignedIn, SignedOut, UserButton } from "@clerk/nextjs";

export default function Header() {
  return (
    <header style={sx.header}>
      <div style={sx.container}>
        {/* Brand */}
        <Link href="/" style={sx.brand} aria-label="Data Refine Home">
          <span style={sx.brandLeft}>Data</span>
          <span style={sx.brandRight}>Refine</span>
        </Link>

        {/* Nav */}
        <nav style={sx.nav}>
          <Link href="/" style={sx.link}>Home</Link>
          <Link href="/about" style={sx.link}>About</Link>

          <SignedIn>
            <div style={{ marginLeft: 8 }}>
              <UserButton appearance={{ variables: { colorPrimary: "#3b82f6" } }} />
            </div>
          </SignedIn>

          <SignedOut>
            <SignInButton mode="modal">
              <button style={sx.signIn}>Sign In</button>
            </SignInButton>
          </SignedOut>
        </nav>
      </div>
    </header>
  );
}

const sx = {
  header: {
    position: "sticky",
    top: 0,
    zIndex: 50,
    background: "linear-gradient(135deg, #0a192f 0%, #112240 60%, #1e3a8a 100%)",
    borderBottom: "1px solid rgba(255,255,255,0.08)",
    boxShadow: "0 6px 22px rgba(0,0,0,0.35)",
  },
  container: {
    maxWidth: 1200,
    margin: "0 auto",
    padding: "12px 24px",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    minHeight: 64,
  },
  brand: {
    display: "inline-flex",
    alignItems: "baseline",
    gap: 6,
    textDecoration: "none",
    userSelect: "none",
  },
  brandLeft: {
    fontSize: "1.35rem",
    fontWeight: 800,
    background: "linear-gradient(90deg, #60a5fa, #93c5fd)",
    WebkitBackgroundClip: "text",
    backgroundClip: "text",
    color: "transparent",
    letterSpacing: 0.2,
  },
  brandRight: {
    fontSize: "1.35rem",
    fontWeight: 700,
    background: "linear-gradient(90deg, #93c5fd, #e0f2fe)",
    WebkitBackgroundClip: "text",
    backgroundClip: "text",
    color: "transparent",
    letterSpacing: 0.2,
  },
  nav: {
    display: "flex",
    alignItems: "center",
    gap: 20,
  },
  link: {
    color: "rgba(226,232,240,0.92)",
    textDecoration: "none",
    fontWeight: 500,
    fontSize: "0.98rem",
    padding: "6px 0",
  },
  signIn: {
    padding: "8px 14px",
    borderRadius: 999,
    border: "1px solid rgba(255,255,255,0.15)",
    background: "linear-gradient(135deg, #1e40af, #2563eb)",
    color: "#fff",
    fontWeight: 600,
    cursor: "pointer",
    boxShadow: "0 6px 18px rgba(37,99,235,0.3)",
  },
};
