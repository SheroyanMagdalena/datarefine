"use client";

import React, { useState } from "react";

export default function NewProject() {
  const [dataFormat, setDataFormat] = useState("csv");
  const [selectedOptions, setSelectedOptions] = useState<string[]>([]);

  const cleaningOptions = [
    "Handle missing values (imputation)",
    "Normalize formats (dates, numbers, categories)",
    "Remove duplicates",
    "Detect and flag outliers",
    "Basic feature engineering (derived columns)",
  ];

  const toggleOption = (option: string) => {
    setSelectedOptions((prev) =>
      prev.includes(option)
        ? prev.filter((o) => o !== option)
        : [...prev, option]
    );
  };

  return (
    <main className="min-h-screen bg-slate-950 text-slate-100">
      <section className="border-b border-slate-800/80 bg-slate-950/90">
        <div className="max-w-6xl mx-auto px-4 py-10 md:py-12">
          <p className="text-[0.7rem] tracking-[0.3em] uppercase text-sky-300/80 mb-2">
            New project
          </p>
          <h1 className="text-2xl md:text-3xl font-semibold mb-3">
            Set up a refinement flow for your dataset.
          </h1>
          <p className="text-sm md:text-base text-slate-300 max-w-2xl">
            Choose what you’re uploading, see the steps DataRefine will take,
            and decide which cleaning and preparation operations you want to run.
          </p>
        </div>
      </section>

      <section className="max-w-6xl mx-auto px-4 py-10 md:py-12 space-y-8">
        {/* Top layout: left = upload + format, right = progress/steps */}
        <div className="grid gap-8 md:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)] items-start">
          {/* Left: upload & format selection */}
          <div className="border border-slate-800/80 rounded-2xl bg-slate-950/80 px-5 py-6 space-y-5">
            <div>
              <h2 className="text-sm md:text-base font-semibold mb-2 text-sky-300/80">
                Dataset details
              </h2>
              <label className="block text-xs text-slate-300 mb-1">
                Project name
              </label>
              <input
                type="text"
                placeholder="e.g. Customer feedback – Q3"
                className="w-full rounded-lg bg-slate-900 border border-slate-700 px-3 py-2 text-sm text-slate-100 placeholder:text-slate-500 focus:outline-none focus:border-sky-400"
              />
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <label className="block text-xs text-slate-300 mb-1">
                  Data format
                </label>
                <select
                  value={dataFormat}
                  onChange={(e) => setDataFormat(e.target.value)}
                  className="w-full rounded-lg bg-slate-900 border border-slate-700 px-3 py-2 text-sm text-slate-100 focus:outline-none focus:border-sky-400"
                >
                  <option value="csv">CSV</option>
                  <option value="excel">Excel (.xlsx, .xls)</option>
                  <option value="json">JSON</option>
                </select>
              </div>

              <div>
                <label className="block text-xs text-slate-300 mb-1">
                  Source file
                </label>
                <input
                  type="file"
                  className="w-full text-xs text-slate-300 file:mr-3 file:rounded-lg file:border-0 file:bg-sky-500 file:px-3 file:py-1.5 file:text-xs file:font-medium file:text-white hover:file:bg-sky-400 cursor-pointer"
                  accept={
                    dataFormat === "csv"
                      ? ".csv"
                      : dataFormat === "excel"
                      ? ".xlsx,.xls"
                      : ".json"
                  }
                />
              </div>
            </div>

            <p className="text-[0.7rem] text-slate-500">
              Supported formats: CSV, Excel, JSON. For large files, DataRefine will
              process them in streaming mode (coming soon).
            </p>
          </div>

          {/* Right: Progress bar / steps */}
          <div className="border border-slate-800/80 rounded-2xl bg-slate-950/80 px-5 py-6">
            <h2 className="text-sm md:text-base font-semibold mb-3 text-sky-300/80">
              What happens to your data
            </h2>

            {/* Progress bar with three steps */}
            <div className="flex flex-col gap-4">
              <div className="flex items-center gap-3">
                <div className="flex-1 h-1.5 rounded-full bg-slate-800 overflow-hidden">
                  <div className="h-full w-1/3 bg-gradient-to-r from-sky-400 via-sky-500 to-indigo-400" />
                </div>
                <span className="text-[0.7rem] text-slate-400">
                  Step 1 of 3
                </span>
              </div>

              <ol className="space-y-3 text-sm text-slate-200">
                <li className="flex gap-3">
                  <span className="mt-0.5 h-5 w-5 rounded-full border border-sky-400 text-[0.65rem] flex items-center justify-center text-sky-300/90">
                    1
                  </span>
                  <div>
                    <p className="font-medium">
                      Upload CSV, Excel, or JSON files
                    </p>
                    <p className="text-xs text-slate-400">
                      DataRefine reads your file, detects structure, and prepares
                      it for profiling.
                    </p>
                  </div>
                </li>
                <li className="flex gap-3">
                  <span className="mt-0.5 h-5 w-5 rounded-full border border-slate-600 text-[0.65rem] flex items-center justify-center text-slate-400">
                    2
                  </span>
                  <div>
                    <p className="font-medium">
                      Automatic schema detection and type inference
                    </p>
                    <p className="text-xs text-slate-400">
                      Columns are analyzed to infer types, constraints, and
                      potential key fields.
                    </p>
                  </div>
                </li>
                <li className="flex gap-3">
                  <span className="mt-0.5 h-5 w-5 rounded-full border border-slate-600 text-[0.65rem] flex items-center justify-center text-slate-400">
                    3
                  </span>
                  <div>
                    <p className="font-medium">
                      Distribution summaries, missingness, and outlier detection
                    </p>
                    <p className="text-xs text-slate-400">
                      DataRefine surfaces data quality issues and patterns so you
                      can decide what to fix first.
                    </p>
                  </div>
                </li>
              </ol>
            </div>
          </div>
        </div>

        {/* Cleaning & preparation options */}
        <div className="border border-slate-800/80 rounded-2xl bg-slate-950/80 px-5 py-6 space-y-4">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2">
            <h2 className="text-sm md:text-base font-semibold text-sky-300/80">
              Data cleaning & preparation options
            </h2>
            <p className="text-[0.7rem] text-slate-500 max-w-md">
              Choose the operations you want DataRefine to run for this project.
              You can adjust these later before executing the pipeline.
            </p>
          </div>

          <div className="grid gap-3 md:grid-cols-2">
            {cleaningOptions.map((option) => (
              <label
                key={option}
                className="flex items-start gap-2 text-xs md:text-sm text-slate-200 cursor-pointer"
              >
                <input
                  type="checkbox"
                  checked={selectedOptions.includes(option)}
                  onChange={() => toggleOption(option)}
                  className="mt-0.5 h-4 w-4 rounded border-slate-600 bg-slate-900 text-sky-400 focus:ring-sky-500"
                />
                <span>{option}</span>
              </label>
            ))}
          </div>

          <div className="flex justify-end pt-2">
            <button
              type="button"
              className="inline-flex items-center justify-center rounded-xl bg-sky-500 hover:bg-sky-400 px-5 py-2 text-sm font-medium text-white shadow-md shadow-sky-500/30 transition"
            >
              Save project & continue
            </button>
          </div>
        </div>
      </section>
    </main>
  );
}
