"use client";

import React, { useState } from "react";

export default function NewProject() {
  const [dataFormat, setDataFormat] = useState("csv");
  const [projectName, setProjectName] = useState("");
  const [fileSelected, setFileSelected] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [targetColumn, setTargetColumn] = useState("");

  // --- Python-aligned choices ---
  const [algorithm, setAlgorithm] = useState("random_forest"); // modeling template
  const [scaler, setScaler] = useState<string>("standard");    // scaling template
  const [encoder, setEncoder] = useState<string>("onehot");    // encoding template

  // Simple toggles for EDA (map to template names under templates/eda)
  const [enableShowHead, setEnableShowHead] = useState(true);              // "head"
  const [enableDescribe, setEnableDescribe] = useState(true);              // "summary_stats"
  const [enableShowShape, setEnableShowShape] = useState(true);            // "shape"
  const [enableCorrelation, setEnableCorrelation] = useState(true);        // "correlation"
  const [enableFeatureTypes, setEnableFeatureTypes] = useState(true);      // "numerical_vs_categorical"
  const [enableTypeCorrection, setEnableTypeCorrection] = useState(true);  // "convert_objects"

  // Cleaning options mapped directly to template names under templates/cleaning
  const [selectedCleaningOptions, setSelectedCleaningOptions] = useState<string[]>([]);

  const cleaningOptions = [
    { key: "handle_missing", label: "Handle missing values (imputation)" },
    { key: "normalize_formats", label: "Normalize formats (dates, numbers, categories)" },
    { key: "remove_duplicates", label: "Remove duplicates" },
    { key: "detect_outliers", label: "Detect and flag outliers" },
    { key: "feature_engineering", label: "Basic feature engineering (derived columns)" },
  ];

  const toggleCleaningOption = (key: string) => {
    setSelectedCleaningOptions((prev) =>
      prev.includes(key) ? prev.filter((o) => o !== key) : [...prev, key]
    );
  };

  // --- Live progress logic (same idea as before) ---
  let currentStep = 1;
  if ((projectName || fileSelected) && !(projectName && fileSelected)) {
    currentStep = 1;
  }
  if (projectName && fileSelected && selectedCleaningOptions.length === 0) {
    currentStep = 2;
  }
  if (projectName && fileSelected && selectedCleaningOptions.length > 0) {
    currentStep = 3;
  }
  const progressPercent = (currentStep / 3) * 100;
  const isStepActive = (step: number) => currentStep >= step;

  // --- Build userJson and send FormData to /api/pipeline ---
  const handleSave = async () => {
    if (!file) {
      console.error("No file selected");
      return;
    }

    // 1) Build EDA list (templates/eda/<name>.py)
    const eda: string[] = [];
    if (enableShowHead) eda.push("head");
    if (enableShowShape) eda.push("shape");
    if (enableDescribe) eda.push("summary_stats");
    if (enableCorrelation) eda.push("correlation");
    if (enableFeatureTypes) eda.push("numerical_vs_categorical");
    if (enableTypeCorrection) eda.push("convert_objects");

    // 2) Cleaning list (already in template name form)
    const cleaning: string[] = [...selectedCleaningOptions];

    // 3) Encoding (single-choice → array of one or empty)
    const encoding: string[] = encoder ? [encoder] : [];

    // 4) Scaling (single-choice → array of one or empty)
    const scaling: string[] = scaler ? [scaler] : [];

    // 5) Modeling (single-choice → array of one or empty)
    const modeling: string[] = algorithm ? [algorithm] : [];

    const userJson = {
      eda,
      cleaning,
      encoding,
      scaling,
      modeling,
    };

    console.log("🔧 userJson for build_pipeline:", userJson);

    // Map UI dataFormat -> file_type for Python
    let fileType = "csv";
    if (dataFormat === "excel") fileType = "xlsx";
    else if (dataFormat === "json") {
      // until you add JSON support in Python, keep as csv or adjust backend
      fileType = "csv";
    }

    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("config", JSON.stringify(userJson));
      formData.append("file_type", fileType);
      formData.append("target", targetColumn || "");

      const res = await fetch("/api/pipeline", {
        method: "POST",
        body: formData, // NO headers, browser sets multipart boundary
      });

      if (!res.ok) {
        const err = await res.json().catch(() => null);
        console.error("Failed to run pipeline:", err || res.statusText);
        return;
      }

      const data = await res.json();
      console.log("✅ Pipeline result from Python:", data); // { preview, columns }
      // later: set state for preview table / navigate to results page
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <main className="min-h-screen bg-slate-950 text-slate-100">
      {/* Header */}
      <section className="border-b border-slate-800/80 bg-slate-950/90">
        <div className="max-w-6xl mx-auto px-4 py-8 md:py-10">
          <p className="text-[0.7rem] tracking-[0.3em] uppercase text-sky-300/80 mb-2">
            New project
          </p>
          <h1 className="text-2xl md:text-3xl font-semibold mb-2">
            Set up a refinement flow for your dataset
          </h1>
          <p className="text-sm md:text-base text-slate-300 max-w-2xl">
            Describe your dataset, upload a file, and choose which cleaning,
            preparation, and modeling steps DataRefine should run.
          </p>
        </div>
      </section>

      <section className="max-w-6xl mx-auto px-4 py-8 md:py-10 space-y-8">
        {/* Top layout: left = upload/details, right = progress */}
        <div className="grid gap-8 md:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)] items-start">
          {/* Left: dataset & model details */}
          <div className="border border-slate-800/80 rounded-2xl bg-slate-950/80 px-5 py-6 space-y-5">
            <div>
              <h2 className="text-sm md:text-base font-semibold mb-3 text-sky-300/80">
                Dataset details
              </h2>
              <label className="block text-xs text-slate-300 mb-1">
                Project name
              </label>
              <input
                type="text"
                value={projectName}
                onChange={(e) => setProjectName(e.target.value)}
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
                  onChange={(e) => {
                    const f = e.target.files?.[0] || null;
                    setFile(f);
                    setFileSelected(!!f);
                  }}
                />
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <label className="block text-xs text-slate-300 mb-1">
                  Target column
                </label>
                <input
                  type="text"
                  value={targetColumn}
                  onChange={(e) => setTargetColumn(e.target.value)}
                  placeholder="e.g. churn, label, price"
                  className="w-full rounded-lg bg-slate-900 border border-slate-700 px-3 py-2 text-sm text-slate-100 placeholder:text-slate-500 focus:outline-none focus:border-sky-400"
                />
              </div>
              <div>
                <label className="block text-xs text-slate-300 mb-1">
                  Model
                </label>
                <select
                  value={algorithm}
                  onChange={(e) => setAlgorithm(e.target.value)}
                  className="w-full rounded-lg bg-slate-900 border border-slate-700 px-3 py-2 text-sm text-slate-100 focus:outline-none focus:border-sky-400"
                >
                  <option value="">No model</option>
                  <option value="random_forest">Random Forest</option>
                  <option value="logistic_regression">Logistic Regression</option>
                  <option value="xgboost">XGBoost</option>
                </select>
              </div>
            </div>

            <p className="text-[0.7rem] text-slate-500">
              Supported formats: CSV, Excel, JSON. Large files will be processed in
              chunks to keep the UI responsive.
            </p>
          </div>

          {/* Right: Live progress bar / steps */}
          <div className="border border-slate-800/80 rounded-2xl bg-slate-950/80 px-5 py-6">
            <h2 className="text-sm md:text-base font-semibold mb-4 text-sky-300/80">
              Progress
            </h2>

            <div className="flex items-center gap-3 mb-5">
              <div className="flex-1 h-1.5 rounded-full bg-slate-800 overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-sky-400 via-sky-500 to-indigo-400 transition-all duration-300"
                  style={{ width: `${progressPercent}%` }}
                />
              </div>
              <span className="text-[0.7rem] text-slate-400">
                Step {currentStep} of 3
              </span>
            </div>

            <ol className="space-y-3 text-sm text-slate-200">
              <li className="flex gap-3">
                <span
                  className={`mt-0.5 h-5 w-5 rounded-full border text-[0.65rem] flex items-center justify-center ${
                    isStepActive(1)
                      ? "border-sky-400 text-sky-300/90 bg-sky-400/10"
                      : "border-slate-600 text-slate-400"
                  }`}
                >
                  1
                </span>
                <div>
                  <p className="font-medium">Describe & upload your dataset</p>
                  <p className="text-xs text-slate-400">
                    Add a project name and upload a CSV, Excel, or JSON file so
                    DataRefine can read its structure.
                  </p>
                </div>
              </li>

              <li className="flex gap-3">
                <span
                  className={`mt-0.5 h-5 w-5 rounded-full border text-[0.65rem] flex items-center justify-center ${
                    isStepActive(2)
                      ? "border-sky-400 text-sky-300/90 bg-sky-400/10"
                      : "border-slate-600 text-slate-400"
                  }`}
                >
                  2
                </span>
                <div>
                  <p className="font-medium">
                    Automatic schema & quality profiling
                  </p>
                  <p className="text-xs text-slate-400">
                    Once your file is set, DataRefine infers column types, detects
                    missingness, and surfaces basic data quality issues.
                  </p>
                </div>
              </li>

              <li className="flex gap-3">
                <span
                  className={`mt-0.5 h-5 w-5 rounded-full border text-[0.65rem] flex items-center justify-center ${
                    isStepActive(3)
                      ? "border-sky-400 text-sky-300/90 bg-sky-400/10"
                      : "border-slate-600 text-slate-400"
                  }`}
                >
                  3
                </span>
                <div>
                  <p className="font-medium">
                    Choose cleaning & preparation operations
                  </p>
                  <p className="text-xs text-slate-400">
                    Your selections shape the refinement pipeline and the generated
                    Python script.
                  </p>
                </div>
              </li>
            </ol>
          </div>
        </div>

        {/* EDA & feature analysis quick toggles */}
        <div className="border border-slate-800/80 rounded-2xl bg-slate-950/80 px-5 py-6 space-y-4">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2">
            <h2 className="text-sm md:text-base font-semibold text-sky-300/80">
              Exploratory analysis
            </h2>
            <p className="text-[0.7rem] text-slate-500 max-w-md">
              These checkboxes map directly to <code>eda</code> templates in the
              Python pipeline.
            </p>
          </div>

          <div className="grid gap-3 md:grid-cols-2 text-xs md:text-sm">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={enableShowHead}
                onChange={(e) => setEnableShowHead(e.target.checked)}
                className="h-4 w-4 rounded border-slate-600 bg-slate-900 text-sky-400 focus:ring-sky-500"
              />
              <span>Show head of the dataset (head)</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={enableShowShape}
                onChange={(e) => setEnableShowShape(e.target.checked)}
                className="h-4 w-4 rounded border-slate-600 bg-slate-900 text-sky-400 focus:ring-sky-500"
              />
              <span>Show shape (rows, columns) (shape)</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={enableDescribe}
                onChange={(e) => setEnableDescribe(e.target.checked)}
                className="h-4 w-4 rounded border-slate-600 bg-slate-900 text-sky-400 focus:ring-sky-500"
              />
              <span>Summary statistics (summary_stats)</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={enableCorrelation}
                onChange={(e) => setEnableCorrelation(e.target.checked)}
                className="h-4 w-4 rounded border-slate-600 bg-slate-900 text-sky-400 focus:ring-sky-500"
              />
              <span>Correlation matrix (correlation)</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={enableFeatureTypes}
                onChange={(e) => setEnableFeatureTypes(e.target.checked)}
                className="h-4 w-4 rounded border-slate-600 bg-slate-900 text-sky-400 focus:ring-sky-500"
              />
              <span>Show numerical vs categorical columns (numerical_vs_categorical)</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={enableTypeCorrection}
                onChange={(e) => setEnableTypeCorrection(e.target.checked)}
                className="h-4 w-4 rounded border-slate-600 bg-slate-900 text-sky-400 focus:ring-sky-500"
              />
              <span>Try to convert object columns that look numeric (convert_objects)</span>
            </label>
          </div>
        </div>

        {/* Cleaning & preparation + preprocessing */}
        <div className="border border-slate-800/80 rounded-2xl bg-slate-950/80 px-5 py-6 space-y-4">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2">
            <h2 className="text-sm md:text-base font-semibold text-sky-300/80">
              Data cleaning & preparation
            </h2>
            <p className="text-[0.7rem] text-slate-500 max-w-md">
              These options fill the <code>cleaning</code>, <code>encoding</code>, and{" "}
              <code>scaling</code> sections for <code>build_pipeline</code>.
            </p>
          </div>

          <div className="grid gap-3 md:grid-cols-2">
            {cleaningOptions.map((opt) => (
              <label
                key={opt.key}
                className="flex items-start gap-2 text-xs md:text-sm text-slate-200 cursor-pointer"
              >
                <input
                  type="checkbox"
                  checked={selectedCleaningOptions.includes(opt.key)}
                  onChange={() => toggleCleaningOption(opt.key)}
                  className="mt-0.5 h-4 w-4 rounded border-slate-600 bg-slate-900 text-sky-400 focus:ring-sky-500"
                />
                <span>{opt.label}</span>
              </label>
            ))}
          </div>

          <div className="border-t border-slate-800/80 pt-4 mt-2 grid gap-4 md:grid-cols-2">
            <div>
              <label className="block text-xs text-slate-300 mb-1">
                Scaling (numeric features)
              </label>
              <select
                value={scaler}
                onChange={(e) => setScaler(e.target.value)}
                className="w-full rounded-lg bg-slate-900 border border-slate-700 px-3 py-2 text-sm text-slate-100 focus:outline-none focus:border-sky-400"
              >
                <option value="">No scaling</option>
                <option value="standard">Standard scaler</option>
                <option value="minmax">Min-max scaler</option>
              </select>
            </div>
            <div>
              <label className="block text-xs text-slate-300 mb-1">
                Categorical encoding
              </label>
              <select
                value={encoder}
                onChange={(e) => setEncoder(e.target.value)}
                className="w-full rounded-lg bg-slate-900 border border-slate-700 px-3 py-2 text-sm text-slate-100 focus:outline-none focus:border-sky-400"
              >
                <option value="">No encoding</option>
                <option value="onehot">One-hot encoding</option>
                <option value="ordinal">Ordinal encoding</option>
              </select>
            </div>
          </div>

          <div className="flex justify-end pt-2">
            <button
              type="button"
              onClick={handleSave}
              className="inline-flex items-center justify-center rounded-xl bg-sky-500 hover:bg-sky-400 px-5 py-2 text-sm font-medium text-white shadow-md shadow-sky-500/30 transition"
            >
              Save project & generate pipeline
            </button>
          </div>
        </div>
      </section>
    </main>
  );
}
