"use client";

import Link from "next/link";
import { SignedIn, SignedOut, RedirectToSignIn } from "@clerk/nextjs";

const recentProjects = [
  {
    id: "1",
    name: "Customer feedback – Q3",
    source: "CSV · 42,318 rows",
    status: "In progress",
    updatedAt: "2 hours ago",
  },
  {
    id: "2",
    name: "Sales transactions – EMMA",
    source: "Excel · 12 sheets",
    status: "Ready for export",
    updatedAt: "Yesterday",
  },
  {
    id: "3",
    name: "Support tickets – API logs",
    source: "JSON · 180k records",
    status: "Profiling complete",
    updatedAt: "3 days ago",
  },
];

export default function ProjectPage() {
  return (
    <>
      <SignedOut>
        <RedirectToSignIn />
      </SignedOut>

      <SignedIn>
        <main className="min-h-screen bg-slate-950 text-slate-100">
          {/* Top bar */}
          <section className="border-b border-slate-800/80 bg-slate-950/90">
            <div className="max-w-6xl mx-auto px-4 py-5 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
              <div>
                <p className="text-[0.7rem] tracking-[0.28em] uppercase text-slate-400">
                  Workspace
                </p>
                <h1 className="text-xl md:text-2xl font-semibold mt-1">
                  Projects & recent datasets
                </h1>
                <p className="text-xs md:text-sm text-slate-400 mt-1 max-w-xl">
                  Create a new refinement space or pick up where you left off. Each project
                  keeps its own history of runs, rules, and exports.
                </p>
              </div>

              <div className="flex gap-3">
                <Link
                  href="/project/new"
                  className="inline-flex items-center justify-center rounded-lg px-4 py-2 text-sm font-medium bg-sky-500 hover:bg-sky-400 text-white shadow-sm shadow-sky-500/30 transition"
                >
                  New project
                </Link>
                <button
                  type="button"
                  className="hidden md:inline-flex items-center justify-center rounded-lg px-3 py-2 text-xs font-medium border border-slate-700 text-slate-200 hover:border-slate-400 transition"
                >
                  Import existing recipe
                </button>
              </div>
            </div>
          </section>

          {/* Main content */}
          <section className="max-w-6xl mx-auto px-4 py-8 md:py-10 flex flex-col gap-8">
            {/* Info strip */}
            <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
              <div className="flex items-start gap-3">
                <div className="h-10 w-0.5 rounded-full bg-gradient-to-b from-sky-500 via-sky-400 to-indigo-500" />
                <div>
                  <p className="text-sm md:text-base text-slate-200">
                    A project is a dedicated space for a dataset and its refinement flow.
                  </p>
                  <p className="text-xs md:text-sm text-slate-400 mt-1">
                    Upload one or more files, define profiling and cleaning rules, then
                    rerun the same pipeline whenever new data arrives.
                  </p>
                </div>
              </div>

              <div className="text-[0.7rem] md:text-xs text-slate-400">
                <p>Supported formats: CSV, Excel, JSON</p>
                <p>Coming soon: database connections & scheduled runs</p>
              </div>
            </div>

            {/* Layout: left small column, right main table */}
            <div className="grid gap-8 md:grid-cols-[minmax(0,0.95fr)_minmax(0,1.3fr)] items-start">
              {/* Left column – quick actions / summary */}
              <div className="space-y-5">
                <div className="border border-slate-800/80 rounded-2xl bg-slate-950/80 px-5 py-4">
                  <h2 className="text-sm font-semibold mb-1.5">
                    Start with a new dataset
                  </h2>
                  <p className="text-xs text-slate-400 mb-3">
                    Create a project when you want to keep a persistent, versioned pipeline
                    instead of a one-off clean-up.
                  </p>
                  <Link
                    href="/project/new"
                    className="inline-flex items-center justify-center rounded-lg px-3 py-1.5 text-xs font-medium bg-sky-500/90 hover:bg-sky-400 text-white transition"
                  >
                    Create project
                  </Link>
                </div>

                <div className="border border-dashed border-slate-700/80 rounded-2xl px-5 py-4">
                  <h3 className="text-xs font-semibold tracking-[0.16em] uppercase text-slate-400 mb-1.5">
                    What a project remembers
                  </h3>
                  <ul className="text-xs text-slate-400 space-y-1.5">
                    <li>• Source files and detected schema</li>
                    <li>• Profiling snapshots and quality issues</li>
                    <li>• Cleaning, normalization, and transformation rules</li>
                    <li>• Versioned runs and exported outputs</li>
                  </ul>
                </div>
              </div>

              {/* Right column – recent projects table */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h2 className="text-sm md:text-base font-semibold">
                    Recent projects
                  </h2>
                  <button
                    type="button"
                    className="text-[0.7rem] text-slate-400 hover:text-sky-300 transition"
                  >
                    View all
                  </button>
                </div>

                <div className="overflow-hidden rounded-2xl border border-slate-800/80 bg-slate-950/80">
                  {recentProjects.length > 0 ? (
                    <table className="min-w-full text-sm">
                      <thead className="bg-slate-900/80 text-xs uppercase tracking-[0.12em] text-slate-400">
                        <tr>
                          <th className="px-4 py-3 text-left font-medium">Project</th>
                          <th className="px-4 py-3 text-left font-medium hidden md:table-cell">
                            Source
                          </th>
                          <th className="px-4 py-3 text-left font-medium">Status</th>
                          <th className="px-4 py-3 text-right font-medium">Updated</th>
                        </tr>
                      </thead>
                      <tbody>
                        {recentProjects.map((project, idx) => (
                          <tr
                            key={project.id}
                            className={`border-t border-slate-800/60 hover:bg-slate-900/80 transition ${
                              idx % 2 === 1 ? "bg-slate-950/60" : ""
                            }`}
                          >
                            <td className="px-4 py-3 align-top">
                              <Link
                                href={`/project/${project.id}`}
                                className="text-slate-100 hover:text-sky-300 transition"
                              >
                                {project.name}
                              </Link>
                              <p className="mt-0.5 text-[0.7rem] text-slate-500 md:hidden">
                                {project.source}
                              </p>
                            </td>
                            <td className="px-4 py-3 text-slate-400 align-top hidden md:table-cell">
                              {project.source}
                            </td>
                            <td className="px-4 py-3 align-top">
                              <span className="inline-flex items-center rounded-full border border-slate-700 px-2.5 py-1 text-[0.68rem] uppercase tracking-[0.14em] text-slate-300">
                                {project.status}
                              </span>
                            </td>
                            <td className="px-4 py-3 text-right text-[0.75rem] text-slate-400 align-top">
                              {project.updatedAt}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  ) : (
                    <div className="px-5 py-8 text-sm text-slate-400">
                      No projects yet. Start by creating your first refinement project
                      on the left.
                    </div>
                  )}
                </div>

                <p className="text-[0.7rem] text-slate-500">
                  DataRefine doesn’t just store files — it keeps the logic that turned raw
                  data into something you can trust, so you can rerun it when new data
                  arrives.
                </p>
              </div>
            </div>
          </section>
        </main>
      </SignedIn>
    </>
  );
}
