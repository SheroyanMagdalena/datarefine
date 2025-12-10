// app/api/pipeline/route.ts
import { NextRequest, NextResponse } from "next/server";

const PYTHON_API_URL = "http://localhost:8000";

export async function POST(req: NextRequest) {
  try {
    // 1) Read incoming multipart/form-data from the browser
    const incomingFormData = await req.formData();

    const file = incomingFormData.get("file") as File | null;
    const config = incomingFormData.get("config") as string | null;

    const rawFileType = incomingFormData.get("file_type");
    const rawTarget = incomingFormData.get("target");

    const file_type =
      typeof rawFileType === "string" && rawFileType.trim()
        ? rawFileType
        : "csv";

    const target =
      typeof rawTarget === "string" ? rawTarget : "";

    if (!file) {
      return NextResponse.json(
        { error: "Missing file upload" },
        { status: 400 }
      );
    }

    if (!config) {
      return NextResponse.json(
        { error: "Missing pipeline config" },
        { status: 400 }
      );
    }

    // 2) Build FormData for Python FastAPI backend
    const fd = new FormData();
    // Give the backend an actual filename as well (FastAPI UploadFile)
    fd.append("file", file, file.name);
    fd.append("config", config);
    fd.append("file_type", file_type);
    fd.append("target", target);

    const url = "http://localhost:8000/build-pipeline";
    console.log("Calling Python backend at:", url);

    // 3) Forward request to Python API
    const pythonRes = await fetch(url, {
      method: "POST",
      body: fd,
      // Don't set Content-Type manually; fetch will handle multipart boundary
    });

    const text = await pythonRes.text();

    // 4) Try to parse JSON response (or wrap error if not JSON)
    let data: any;
    try {
      data = JSON.parse(text);
    } catch {
      // Backend returned non-JSON (e.g. traceback)
      if (!pythonRes.ok) {
        return NextResponse.json(
          {
            error: "Python service error",
            detail: text,
          },
          { status: pythonRes.status }
        );
      }

      // Unexpected non-JSON success response
      return NextResponse.json(
        {
          error: "Unexpected response from Python service",
          detail: text,
        },
        { status: 500 }
      );
    }

    if (!pythonRes.ok) {
      // Backend returned JSON but with non-2xx status
      return NextResponse.json(
        {
          error: data?.error || "Python service error",
          detail: data?.detail ?? data,
        },
        { status: pythonRes.status }
      );
    }

    // 5) Success – pass through preview/columns JSON
    return NextResponse.json(data, { status: 200 });
  } catch (err: any) {
    console.error("Pipeline API error:", err);

    return NextResponse.json(
      {
        error: "Unexpected server error",
        detail: err?.message || String(err),
      },
      { status: 500 }
    );
  }
}
