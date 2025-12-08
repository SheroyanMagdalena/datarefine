"use client";

import React, { useState } from "react";

export default function NewProject() {
  const [dataFormat, setDataFormat] = useState("csv");
  const [selectedCleaningOptions, setSelectedCleaningOptions] = useState<string[]>([]);
  const [projectName, setProjectName] = useState("");
  const [fileSelected, setFileSelected] = useState(false);
  const [targetColumn, setTargetColumn] = useState("");
  const [algorithm, setAlgorithm] = useState("RandomForestClassifier");
  const [scaler, setScaler] = useState<string>("StandardScaler");
  const [encoder, setEncoder] = useState<string>("OneHotEncoder");

  // Simple toggles for EDA and feature analysis
  const [enableShowHead, setEnableShowHead] = useState(true);
  const [enableDescribe, setEnableDescribe] = useState(true);
  const [enableShowShape, setEnableShowShape] = useState(true);
  const [enableCorrelation, setEnableCorrelation] = useState(true);
  const [enableFeatureTypes, setEnableFeatureTypes] = useState(true);
  const [enableTypeCorrection, setEnableTypeCorrection] = useState(true);

  const cleaningOptions = [
    "Handle missing values (imputation)",
    "Normalize formats (dates, numbers, categories)",
    "Remove duplicates",
    "Detect and flag outliers",
    "Basic feature engineering (derived columns)",
  ];

  const toggleCleaningOption = (option: string) => {
    setSelectedCleaningOptions((prev) =>
      prev.includes(option) ? prev.filter((o) => o !== option) : [...prev, option]
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

  // --- Build payload in the exact shape Python expects ---
  const handleSave = async () => {
    // Map UI cleaning options to CLEANING_TEMPLATES keys
    const dataCleaning: any = {};

    if (selectedCleaningOptions.includes("Remove duplicates")) {
      dataCleaning.drop_duplicates = true; // CLEANING_TEMPLATES["drop_duplicates"]
    }

    if (selectedCleaningOptions.includes("Handle missing values (imputation)")) {
      // You can later expose mean/median/mode as a select.
      dataCleaning.missing_strategy = "mean"; // → missing_strategy_mean
    }

    if (selectedCleaningOptions.includes("Detect and flag outliers")) {
      // Choose IQR by default
      dataCleaning.outlier_detection_iqr = true;
    }

    if (selectedCleaningOptions.includes("Basic feature engineering (derived columns)")) {
      // Example: treat as skewness fix (you can change this later)
      dataCleaning.fix_skewness_log = true;
    }

    // FeatureAnalysis block for builder.py
    const featureAnalysis = {
      show_feature_types: enableFeatureTypes,
      type_correction: enableTypeCorrection, // maps to detect_and_fix_object_numerics
    };

    // EDA block – keys must match EDA_TEMPLATES
    const eda = {
      show_head: enableShowHead,
      show_shape: enableShowShape,
      info: true,
      describe: enableDescribe,
      null_values: true,
      nan_values: false,
      correlation: enableCorrelation,
      skewness_test: true,
    };

    // Visualization – simple defaults (can add UI later)
    const visualization = {
      histograms: true,
      heatmap: true,
      boxplots: false,
      pairplot: false,
    };

    // Preprocessing – builder loops over values, not keys
    const preprocessing: any = {};
    if (scaler) {
      preprocessing.scaler = scaler; // e.g. "StandardScaler"
    }
    if (encoder) {
      preprocessing.encoder = encoder; // e.g. "OneHotEncoder"
    }

    // Model block – exactly what builder.py reads
    const model = {
      algorithm,
      target: targetColumn,
    };

    const userInput = {
      Project: {
        name: projectName,
        format: dataFormat,
      },
      FeatureAnalysis: featureAnalysis,
      EDA: eda,
      Visualization: visualization,
      DataCleaning: dataCleaning,
      Preprocessing: preprocessing,
      Model: model,
    };

    // Send to your API route that calls builder.py
    try {
      const res = await fetch("/api/automl", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(userInput),
      });

      if (!res.ok) {
        console.error("Failed to generate pipeline");
      } else {
        console.log("Pipeline config sent successfully");
      }
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
                  onChange={(e) =>
                    setFileSelected(!!e.target.files && e.target.files.length > 0)
                  }
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
                  <option value="RandomForestClassifier">Random Forest</option>
                  <option value="LogisticRegression">Logistic Regression</option>
                  <option value="DecisionTreeClassifier">Decision Tree</option>
                  <option value="XGBoost">XGBoost</option>
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
                    AutoML script.
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
              Choose which quick diagnostic steps DataRefine should include in the
              generated Python pipeline.
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
              <span>Show head of the dataset</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={enableShowShape}
                onChange={(e) => setEnableShowShape(e.target.checked)}
                className="h-4 w-4 rounded border-slate-600 bg-slate-900 text-sky-400 focus:ring-sky-500"
              />
              <span>Show shape (rows, columns)</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={enableDescribe}
                onChange={(e) => setEnableDescribe(e.target.checked)}
                className="h-4 w-4 rounded border-slate-600 bg-slate-900 text-sky-400 focus:ring-sky-500"
              />
              <span>Summary statistics (describe)</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={enableCorrelation}
                onChange={(e) => setEnableCorrelation(e.target.checked)}
                className="h-4 w-4 rounded border-slate-600 bg-slate-900 text-sky-400 focus:ring-sky-500"
              />
              <span>Correlation matrix</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={enableFeatureTypes}
                onChange={(e) => setEnableFeatureTypes(e.target.checked)}
                className="h-4 w-4 rounded border-slate-600 bg-slate-900 text-sky-400 focus:ring-sky-500"
              />
              <span>Show numerical vs categorical columns</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={enableTypeCorrection}
                onChange={(e) => setEnableTypeCorrection(e.target.checked)}
                className="h-4 w-4 rounded border-slate-600 bg-slate-900 text-sky-400 focus:ring-sky-500"
              />
              <span>Try to convert object columns that look numeric</span>
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
              Choose the operations you want this project to run. These map
              directly to steps in the generated Python pipeline.
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
                  checked={selectedCleaningOptions.includes(option)}
                  onChange={() => toggleCleaningOption(option)}
                  className="mt-0.5 h-4 w-4 rounded border-slate-600 bg-slate-900 text-sky-400 focus:ring-sky-500"
                />
                <span>{option}</span>
              </label>
            ))}
          </div>

          <div className="border-t border-slate-800/80 pt-4 mt-2 grid gap-4 md:grid-cols-2">
            <div>
              <label className="block text-xs text-slate-300 mb-1">
                Scaling
              </label>
              <select
                value={scaler}
                onChange={(e) => setScaler(e.target.value)}
                className="w-full rounded-lg bg-slate-900 border border-slate-700 px-3 py-2 text-sm text-slate-100 focus:outline-none focus:border-sky-400"
              >
                <option value="">No scaling</option>
                <option value="StandardScaler">StandardScaler</option>
                <option value="MinMaxScaler">MinMaxScaler</option>
                <option value="RobustScaler">RobustScaler</option>
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
                <option value="OneHotEncoder">OneHotEncoder</option>
                <option value="LabelEncoder">LabelEncoder</option>
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
              //toDO: update user and add project name to db
            </button>
          </div>
        </div>
      </section>
    </main>
  );
}
