// app/api/pipeline/route.ts
import { NextRequest, NextResponse } from "next/server";

const PYTHON_API_URL =
  process.env.PYTHON_API_URL || "http://localhost:8000";

export async function POST(req: NextRequest) {
  try {
    const incomingFormData = await req.formData();

    const file = incomingFormData.get("file") as File | null;
    const config = incomingFormData.get("config") as string | null;
    const file_type =
      (incomingFormData.get("file_type") as string) || "csv";
    const target =
      (incomingFormData.get("target") as string) || "";

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
    fd.set("file", file);
    fd.set("config", config);
    fd.set("file_type", file_type);
    fd.set("target", target);

    const pythonRes = await fetch(
      `${PYTHON_API_URL}/build-pipeline`,
      {
        method: "POST",
        body: fd,
      }
    );

    if (!pythonRes.ok) {
      const errorText = await pythonRes.text();
      return NextResponse.json(
        {
          error: "Python service error",
          detail: errorText,
        },
        { status: pythonRes.status }
      );
    }

    const result = await pythonRes.json();
    return NextResponse.json(result);
  } catch (err: any) {
    console.error("Pipeline API error:", err);

    return NextResponse.json(
      {
        error: "Unexpected server error",
        detail: String(err),
      },
      { status: 500 }
    );
  }
}
