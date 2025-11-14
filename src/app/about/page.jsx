import React from "react";

export default function About() {
  return (
    <main className="min-h-screen bg-slate-950 text-slate-100">
      {/* Top section */}
      <section className="border-b border-slate-800/80 bg-slate-950/80">
        <div className="max-w-6xl mx-auto px-4 py-14 md:py-18">
          <p className="text-xs tracking-[0.25em] uppercase text-sky-300/80 mb-3">
            About DataRefine
          </p>
          <h1 className="text-3xl md:text-4xl font-semibold mb-4">
            A practical, intelligent layer for turning raw data into insight.
          </h1>
          <p className="text-sm md:text-base text-slate-300 max-w-2xl">
            DataRefine is built for people who live in spreadsheets, dashboards, and
            notebooks but don’t want to spend most of their time fixing broken data.
            It automates the heavy lifting around data preparation while keeping every
            change transparent, reviewable, and under your control.
          </p>
        </div>
      </section>

      {/* What & why */}
      <section className="max-w-6xl mx-auto px-4 py-14 md:py-18 grid gap-10 md:grid-cols-2">
        <div>
          <h2 className="text-xl md:text-2xl font-semibold mb-3">
            What DataRefine is solving
          </h2>
          <p className="text-sm md:text-base text-slate-300 mb-4">
            Most analysis work doesn’t fail because the model is wrong. It fails because
            the data is messy, inconsistent, or undocumented. Analysts spend hours:
          </p>
          <ul className="text-sm text-slate-300 space-y-1.5 mb-4">
            <li>• Cleaning the same columns again and again for every new file</li>
            <li>• Chasing down weird values and missing records</li>
            <li>• Rebuilding ad-hoc scripts or formulas with each project</li>
            <li>• Trying to explain what was changed to stakeholders after the fact</li>
          </ul>
          <p className="text-sm md:text-base text-slate-300">
            DataRefine gives you a single, reusable pipeline: you define or approve the
            rules once, and the system applies them consistently, logs the full history,
            and produces an analysis-ready dataset plus a clear story of how it got there.
          </p>
        </div>

        <div className="border border-slate-800 rounded-2xl bg-slate-900/70 p-5">
          <h2 className="text-sm md:text-base font-semibold mb-2">
            Who it’s for
          </h2>
          <p className="text-sm text-slate-300 mb-3">
            DataRefine is designed for teams that care about both speed and rigor:
          </p>
          <ul className="text-sm text-slate-300 space-y-1.5">
            <li>• Data analysts and BI specialists preparing recurring reports</li>
            <li>• Domain experts who need clean, reliable data without writing code</li>
            <li>• Data science teams standardizing inputs for models and experiments</li>
            <li>• Organizations that must document how data was transformed over time</li>
          </ul>
        </div>
      </section>

      {/* Technical foundation */}
      <section className="bg-slate-950/80 border-y border-slate-800/80">
        <div className="max-w-6xl mx-auto px-4 py-14 md:py-18 grid gap-10 md:grid-cols-[minmax(0,1.25fr)_minmax(0,1fr)] items-start">
          <div>
            <h2 className="text-xl md:text-2xl font-semibold mb-3">
              Under the hood: the DataRefine engine
            </h2>
            <p className="text-sm md:text-base text-slate-300 mb-4">
              At its core, DataRefine is a modular, parallelized data pipeline that
              combines statistical checks, rule-based logic, and AI-driven pattern
              recognition. It’s designed to be flexible enough for complex datasets, but
              predictable enough to be trusted in production.
            </p>
            <ul className="text-sm text-slate-300 space-y-2">
              <li>
                <span className="font-semibold text-slate-100">Multi-format ingestion.</span>{" "}
                Native support for CSV, Excel, and JSON, with schema inference and type
                detection to quickly map the structure of your dataset.
              </li>
              <li>
                <span className="font-semibold text-slate-100">Profiling & quality checks.</span>{" "}
                Automated summaries of distributions, missingness, outliers, and
                anomalies to highlight the most impactful issues first.
              </li>
              <li>
                <span className="font-semibold text-slate-100">Cleaning & standardization.</span>{" "}
                Imputation strategies, normalization rules, de-duplication, and format
                harmonization that can be reused as versioned “recipes.”
              </li>
              <li>
                <span className="font-semibold text-slate-100">Transformations & feature logic.</span>{" "}
                Column derivations, table reshaping, and rule-driven transformations
                that keep business logic close to the data.
              </li>
              <li>
                <span className="font-semibold text-slate-100">Explainable decision layer.</span>{" "}
                AI-assisted suggestions are accompanied by human-readable rationales,
                so you always see why a change is recommended.
              </li>
            </ul>
          </div>

          <div className="border border-slate-800 rounded-2xl bg-slate-900/70 p-5 text-sm text-slate-200">
            <h3 className="text-sm font-semibold mb-2">
              What “versioned transformations” means in practice
            </h3>
            <p className="mb-3">
              Every run in DataRefine is tracked as a pipeline version. When you adjust a
              rule, change a threshold, or add a new transformation step, the system
              records it as a new, traceable configuration.
            </p>
            <p className="mb-3">
              That means you can always answer questions like:
            </p>
            <ul className="space-y-1.5 text-sm">
              <li>• What exactly changed between last month’s and this month’s dataset?</li>
              <li>• Which rules were applied to produce this report?</li>
              <li>• Can we re-run this pipeline on a new file and get the same logic?</li>
            </ul>
            <p className="mt-3">
              This approach makes audits, reproducibility, and collaborative work much
              easier than one-off scripts or manual spreadsheet changes.
            </p>
          </div>
        </div>
      </section>

      {/* Compact roadmap / closing */}
      <section className="max-w-6xl mx-auto px-4 py-14 md:py-18">
        <div className="grid gap-10 md:grid-cols-2 items-start">
          <div>
            <h2 className="text-xl md:text-2xl font-semibold mb-3">
              Where DataRefine is heading
            </h2>
            <p className="text-sm md:text-base text-slate-300 mb-4">
              The initial focus is a robust, explainable core that feels reliable for
              everyday analytical work. From there, the roadmap extends toward deeper
              automation and collaboration.
            </p>
            <ul className="text-sm text-slate-300 space-y-2">
              <li>• Reusable templates for recurring datasets and reporting cycles</li>
              <li>• Team workspaces for sharing pipelines and quality reports</li>
              <li>• Richer integrations with notebooks, BI tools, and APIs</li>
              <li>• More advanced anomaly detection and scenario testing</li>
            </ul>
          </div>

          <div className="border border-slate-800 rounded-3xl bg-gradient-to-r from-slate-900 via-slate-950 to-slate-900 px-6 py-6 md:px-7 md:py-7">
            <h3 className="text-sm md:text-base font-semibold mb-2">
              The idea in one sentence
            </h3>
            <p className="text-sm md:text-base text-slate-300 mb-4">
              DataRefine aims to be the place where raw, inconsistent data becomes a
              clean, documented, analysis-ready asset — without requiring you to be a
              full-time engineer.
            </p>
            <p className="text-xs md:text-sm text-slate-400">
              Upload a messy dataset, follow a guided flow, and leave not just with
              better data, but with a clear explanation of how it improved. That’s the
              core promise of DataRefine.
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}
