"use client";

import React, {useState} from "react";

export default function NewProject() {
  const [dataFormat, setDataFormat] = useState("csv");
  const [projectName, setProjectName] = useState("");
  const [fileSelected, setFileSelected] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [targetColumn, setTargetColumn] = useState("");

  const [algorithm, setAlgorithm] = useState("random_forest"); // modeling template
  const [scaler, setScaler] = useState<string>("standard");    // scaling template
  const [encoder, setEncoder] = useState<string>("onehot");    // encoding template

  const [enableShowHead, setEnableShowHead] = useState(true);              // "head"
  const [enableDescribe, setEnableDescribe] = useState(true);              // "summary_stats"
  const [enableShowShape, setEnableShowShape] = useState(true);            // "shape"
  const [enableCorrelation, setEnableCorrelation] = useState(true);        // "correlation"
  const [enableFeatureTypes, setEnableFeatureTypes] = useState(true);      // "numerical_vs_categorical"
  const [enableTypeCorrection, setEnableTypeCorrection] = useState(true);  // "convert_objects"

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

  const [preview, setPreview] = useState<any[] | null>(null);
  const [columns, setColumns] = useState<string[] | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

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

  const handleSave = async () => {
    setError(null);
    setPreview(null);
    setColumns(null);

    if (!file) {
      setError("Please upload a file first.");
      return;
    }

    if (!projectName) {
      setError("Please give your project a name.");
      return;
    }

    let fileType: string;
    if (dataFormat === "csv") {
      fileType = "csv";
    } else if (dataFormat === "excel") {
      fileType = "xlsx";
    } else {
      setError("JSON files are not supported yet. Please use CSV or Excel.");
      return;
    }

    const eda: string[] = [];
    if (enableShowHead) eda.push("head");
    if (enableShowShape) eda.push("shape");
    if (enableDescribe) eda.push("summary_stats");
    if (enableCorrelation) eda.push("correlation");
    if (enableFeatureTypes) eda.push("numerical_vs_categorical");
    if (enableTypeCorrection) eda.push("convert_objects");

    const cleaning: string[] = [...selectedCleaningOptions];

    const encoding: string[] = encoder ? [encoder] : [];

    const scaling: string[] = scaler ? [scaler] : [];

    const modeling: string[] = algorithm ? [algorithm] : [];

    type StepConfig = { module: string; function: string };

    const steps: StepConfig[] = [];

    cleaning.forEach((fn) => {
      steps.push({ module: "cleaning", function: fn });
    });

    eda.forEach((fn) => {
      steps.push({ module: "eda", function: fn });
    });

    encoding.forEach((fn) => {
      steps.push({ module: "encoding", function: fn });
    });

    scaling.forEach((fn) => {
      steps.push({ module: "scaling", function: fn });
    });

    modeling.forEach((fn) => {
      steps.push({ module: "modeling", function: fn });
    });

    const userJson = {
      steps,
    };

    console.log("🔧 userJson for build_pipeline (steps array):", userJson);

    try {
      setLoading(true);

      const formData = new FormData();
      formData.append("file", file);
      formData.append("config", JSON.stringify(userJson));
      formData.append("file_type", fileType);
      formData.append("target", targetColumn || "");

      const res = await fetch("/api/pipeline", {
        method: "POST",
        body: formData,
      });

      if (!res.ok) {
        let message = `Pipeline request failed with status ${res.status}`;
        try {
          const errBody = await res.json();
          if (errBody?.error) {
            message = `${errBody.error}${
              errBody.detail ? `: ${errBody.detail}` : ""
            }`;
          }
        } catch {
          // ignoring JSON parse error
        }
        setError(message);
        return;
      }

      const data = await res.json();
      console.log("Pipeline result from Python: ", data);

      setPreview(data.preview || []);
      setColumns(data.columns || []);
    } catch (e: any) {
      console.error(e);
      setError(e?.message || "Unexpected error while running pipeline.");
    } finally {
      setLoading(false);
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
                  onChange={(e) => {
                    setDataFormat(e.target.value);
                    setError(null);
                    setPreview(null);
                    setColumns(null);
                  }}
                  className="w-full rounded-lg bg-slate-900 border border-slate-700 px-3 py-2 text-sm text-slate-100 focus:outline-none focus:border-sky-400"
                >
                  <option value="csv">CSV</option>
                  <option value="excel">Excel (.xlsx, .xls)</option>
                  {}
                  <option value="json" disabled>
                    JSON (coming soon)
                  </option>
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
                      : ".xlsx,.xls"
                  }
                  onChange={(e) => {
                    const f = e.target.files?.[0] || null;
                    setFile(f);
                    setFileSelected(!!f);
                    setError(null);
                    setPreview(null);
                    setColumns(null);
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
              Supported formats: CSV, Excel (.xls, .xlsx). JSON support will be
              added once the Python backend supports it.
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
                    Add a project name and upload a CSV or Excel file so
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

        {/* Error state */}
        {error && (
          <div className="border border-red-500/50 bg-red-500/10 text-red-200 text-sm rounded-xl px-4 py-3">
            {error}
          </div>
        )}

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
              These options fill the cleaning, encoding, and scaling steps for{" "}
              <code>build_pipeline</code>.
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

          <div className="flex justify-end pt-2 gap-3">
            <button
              type="button"
              onClick={() => window.open("https://datarefine-python.onrender.com/download-report", "_blank")}
              className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded"
            >
              Download Report
            </button>

            <button
              type="button"
              onClick={handleSave}
              disabled={loading || !file || !projectName}
              className={`inline-flex items-center justify-center rounded-xl px-5 py-2 text-sm font-medium text-white shadow-md shadow-sky-500/30 transition
                ${
                  loading || !file || !projectName
                    ? "bg-slate-600 cursor-not-allowed"
                    : "bg-sky-500 hover:bg-sky-400"
                }`}
            >
              {loading ? "Running pipeline..." : "Save project & generate pipeline"}
            </button>
          </div>
        </div>

        {/* Preview table from Python backend */}
        {columns && preview && preview.length > 0 && (
          <div className="border border-slate-800/80 rounded-2xl bg-slate-950/80 px-5 py-6 space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-sm md:text-base font-semibold text-sky-300/80">
                Preview (first {preview.length} rows after pipeline)
              </h2>
              <p className="text-[0.7rem] text-slate-500">
                DataRefine preview returned from Python backend.
              </p>
            </div>

            <div className="max-h-[420px] overflow-auto border border-slate-800/80 rounded-xl">
              <table className="min-w-full text-xs md:text-sm border-collapse">
                <thead className="bg-slate-900/90">
                  <tr>
                    {columns.map((col) => (
                      <th
                        key={col}
                        className="px-3 py-2 border-b border-slate-800 text-left font-medium text-slate-200 sticky top-0 bg-slate-900/95"
                      >
                        {col}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {preview.map((row, i) => (
                    <tr key={i} className="odd:bg-slate-950 even:bg-slate-900/40">
                      {columns.map((col) => (
                        <td
                          key={col}
                          className="px-3 py-1.5 border-b border-slate-900/60 text-slate-100"
                        >
                          {row[col] !== null && row[col] !== undefined
                            ? String(row[col])
                            : ""}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </section>
    </main>
  );
}
