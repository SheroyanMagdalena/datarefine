import { NextRequest, NextResponse } from "next/server";

const PYTHON_API_URL = "https://datarefine-python.onrender.com";

export async function POST(req: NextRequest) {
  try {
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

    const fd = new FormData();

    fd.append("file", file, file.name);
    fd.append("config", config);
    fd.append("file_type", file_type);
    fd.append("target", target);

    const url = "https://datarefine-python.onrender.com/build-pipeline";
    console.log("Calling Python backend at:", url);

    const pythonRes = await fetch(url, {
      method: "POST",
      body: fd,
    });

    const text = await pythonRes.text();

    let data: any;
    try {
      data = JSON.parse(text);
    } catch {
      if (!pythonRes.ok) {
        return NextResponse.json(
          {
            error: "Python service error",
            detail: text,
          },
          { status: pythonRes.status }
        );
      }

      return NextResponse.json(
        {
          error: "Unexpected response from Python service",
          detail: text,
        },
        { status: 500 }
      );
    }

    if (!pythonRes.ok) {
      return NextResponse.json(
        {
          error: data?.error || "Python service error",
          detail: data?.detail ?? data,
        },
        { status: pythonRes.status }
      );
    }

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
