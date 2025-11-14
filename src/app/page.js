import React from 'react'

export default function Home() {
  return (
    <main className="min-h-screen bg-slate-950 text-slate-100">
      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(56,189,248,0.18),_transparent_55%),_radial-gradient(circle_at_bottom,_rgba(129,140,248,0.16),_transparent_55%)]" />
        <div className="relative max-w-6xl mx-auto px-4 py-16 md:py-24">
          <div className="max-w-2xl">
            <p className="text-xs tracking-[0.25em] uppercase text-sky-300/80 mb-4">
              DataRefine • Intelligent Data Preparation
            </p>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-semibold leading-tight md:leading-[1.1]">
              Turn messy data into
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-sky-400 via-blue-400 to-indigo-400">
                analysis-ready insight.
              </span>
            </h1>
            <p className="mt-6 text-base md:text-lg text-slate-300 max-w-xl">
              DataRefine automates the entire data preparation workflow&nbsp;— from ingestion and profiling
              to cleaning, transformation, and analysis. Upload your CSV, Excel, or JSON files and let the
              system do the heavy lifting.
            </p>

            <div className="mt-8 flex flex-col sm:flex-row gap-4">
              <button className="inline-flex justify-center rounded-xl px-6 py-3 text-sm font-medium bg-sky-500 hover:bg-sky-400 transition shadow-lg shadow-sky-500/25">
                Start refining a dataset
              </button>
              <button className="inline-flex justify-center rounded-xl px-6 py-3 text-sm font-medium border border-slate-600/70 hover:border-slate-400/90 bg-slate-900/50">
                Explore how DataRefine works
              </button>
            </div>

            <p className="mt-4 text-xs text-slate-400 max-w-md">
              No advanced engineering skills required. DataRefine keeps every transformation versioned and
              explainable, so you always know what changed and why.
            </p>
          </div>
        </div>
      </section>

      {/* Value summary */}
      <section className="border-y border-slate-800/70 bg-slate-950/60">
        <div className="max-w-6xl mx-auto px-4 py-10 md:py-12 grid gap-6 md:grid-cols-3">
          <div className="border border-slate-800/80 rounded-2xl bg-slate-900/60 p-5">
            <h3 className="text-sm font-semibold text-slate-100 mb-2">
              Automate the boring parts
            </h3>
            <p className="text-sm text-slate-300">
              Detect anomalies, fix missing values, normalize formats, and restructure columns in a guided,
              repeatable workflow instead of manual spreadsheet work.
            </p>
          </div>
          <div className="border border-slate-800/80 rounded-2xl bg-slate-900/60 p-5">
            <h3 className="text-sm font-semibold text-slate-100 mb-2">
              Stay in control of every change
            </h3>
            <p className="text-sm text-slate-300">
              Each transformation step is versioned and documented. Explainable AI insights show why a rule
              was applied, helping you trust and audit the final dataset.
            </p>
          </div>
          <div className="border border-slate-800/80 rounded-2xl bg-slate-900/60 p-5">
            <h3 className="text-sm font-semibold text-slate-100 mb-2">
              Designed for large datasets
            </h3>
            <p className="text-sm text-slate-300">
              A modular, parallelized pipeline keeps performance high even when files grow large — without
              sacrificing transparency or data quality checks.
            </p>
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="max-w-6xl mx-auto px-4 py-16 md:py-20">
        <div className="grid gap-10 md:grid-cols-[minmax(0,1.3fr)_minmax(0,1fr)] items-start">
          <div>
            <h2 className="text-2xl md:text-3xl font-semibold mb-3">
              A clear pipeline from raw data to ready insight
            </h2>
            <p className="text-sm md:text-base text-slate-300 mb-6 max-w-xl">
              DataRefine combines statistical modeling, rule-based logic, and AI-driven pattern recognition
              in a single, guided flow. You decide the goal; the tool orchestrates the steps.
            </p>

            <ol className="space-y-4 text-sm md:text-base">
              <li className="border border-slate-800 rounded-2xl bg-slate-900/60 px-4 py-3">
                <p className="text-xs uppercase tracking-[0.16em] text-sky-300/80 mb-1">
                  Step 1 · Ingest & profile
                </p>
                <p className="text-slate-100">
                  Upload CSV, Excel, or JSON files. DataRefine instantly profiles structure, types, missing
                  values, and outliers to give you a quick health check of your dataset.
                </p>
              </li>
              <li className="border border-slate-800 rounded-2xl bg-slate-900/60 px-4 py-3">
                <p className="text-xs uppercase tracking-[0.16em] text-sky-300/80 mb-1">
                  Step 2 · Clean & standardize
                </p>
                <p className="text-slate-100">
                  The engine proposes fixes for inconsistent formats, duplicates, and anomalies. You can
                  accept, adjust, or reject suggestions before they are applied.
                </p>
              </li>
              <li className="border border-slate-800 rounded-2xl bg-slate-900/60 px-4 py-3">
                <p className="text-xs uppercase tracking-[0.16em] text-sky-300/80 mb-1">
                  Step 3 · Transform & enrich
                </p>
                <p className="text-slate-100">
                  Reshape tables, engineer features, and create derived columns using a mix of predefined
                  transformations and AI-assisted rules tailored to your data.
                </p>
              </li>
              <li className="border border-slate-800 rounded-2xl bg-slate-900/60 px-4 py-3">
                <p className="text-xs uppercase tracking-[0.16em] text-sky-300/80 mb-1">
                  Step 4 · Analyze & export
                </p>
                <p className="text-slate-100">
                  Explore patterns, distributions, and correlations in an interactive summary. Then export an
                  analysis-ready dataset and a transparent report of all changes.
                </p>
              </li>
            </ol>
          </div>

          {/* Right side – audience & outcomes */}
          <div className="space-y-6">
            <div className="border border-slate-800 rounded-2xl bg-slate-900/70 p-5">
              <h3 className="text-sm font-semibold mb-2">Built for data analysts and teams</h3>
              <p className="text-sm text-slate-300 mb-3">
                Whether you are cleaning survey results, consolidating operational data, or preparing inputs
                for machine learning, DataRefine reduces the time you spend on low-value wrangling.
              </p>
              <ul className="text-xs text-slate-300 space-y-1">
                <li>• Analysts who want reliable, documented datasets</li>
                <li>• Domain experts who need clean data without writing code</li>
                <li>• Teams standardizing data preparation across projects</li>
              </ul>
            </div>

            <div className="border border-slate-800 rounded-2xl bg-slate-900/70 p-5">
              <h3 className="text-sm font-semibold mb-2">What you get after each run</h3>
              <ul className="text-sm text-slate-300 space-y-2">
                <li>• A cleaned, organized dataset ready for BI tools or notebooks</li>
                <li>• A visual, narrative report of how data quality improved</li>
                <li>• A versioned pipeline you can reuse and adapt for future files</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Transparency   */}
      <section className="bg-slate-950/70 border-t border-slate-800/80">
        <div className="max-w-6xl mx-auto px-4 py-14 md:py-18 grid gap-8 md:grid-cols-2">
          <div>
            <h2 className="text-2xl md:text-3xl font-semibold mb-3">
              Transparent by design, not a black box
            </h2>
            <p className="text-sm md:text-base text-slate-300 mb-4">
              Many tools promise “AI-powered cleaning” but leave you guessing what changed. DataRefine keeps a
              full timeline of transformation steps with human-readable explanations.
            </p>
            <p className="text-sm md:text-base text-slate-300">
              Every imputation, normalization, or structural adjustment is logged with the logic behind it —
              from statistical thresholds to rule-based decisions and AI-detected patterns. This makes it
              easier to review, replicate, and defend your data preparation process.
            </p>
          </div>
          <div className="border border-slate-800 rounded-2xl bg-slate-900/70 p-5 text-sm text-slate-200">
            <p className="text-xs uppercase tracking-[0.16em] text-sky-300/80 mb-2">
              Example outcome
            </p>
            <p className="mb-3">
              “In this dataset, 6% of values in the <span className="font-mono">customer_age</span> column
              were missing. Based on the distribution by segment, DataRefine used segmented median imputation
              to fill gaps while preserving overall variance.”
            </p>
            <p className="mb-3">
              “Postal codes were stored in three different formats. We standardized them to a single pattern
              and flagged 42 entries as invalid based on country-specific rules.”
            </p>
            <p>
              These insights appear alongside charts and before/after summaries, so you can quickly see how
              the dataset evolved.
            </p>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="max-w-6xl mx-auto px-4 py-14 md:py-18">
        <div className="border border-slate-800/90 rounded-3xl bg-gradient-to-r from-slate-900 via-slate-950 to-slate-900 px-6 py-8 md:px-10 md:py-10">
          <div className="max-w-2xl">
            <h2 className="text-2xl md:text-3xl font-semibold mb-3">
              Get from raw data to decisions in a single, guided flow.
            </h2>
            <p className="text-sm md:text-base text-slate-300 mb-6">
              DataRefine is built to feel powerful for experts and approachable for everyone else. Upload a
              messy file, follow the suggested steps, and leave with an analysis-ready dataset and a clear
              story of how it was improved.
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-4">
            <button className="inline-flex justify-center rounded-xl px-6 py-3 text-sm font-medium bg-sky-500 hover:bg-sky-400 transition shadow-lg shadow-sky-500/25">
              Try DataRefine on a sample dataset
            </button>
            <button className="inline-flex justify-center rounded-xl px-6 py-3 text-sm font-medium border border-slate-600/70 hover:border-slate-400/90 bg-slate-900/60">
              View a sample data quality report
            </button>
          </div>
        </div>
      </section>
    </main>
  )
}
