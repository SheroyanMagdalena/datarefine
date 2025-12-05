import { NextRequest, NextResponse } from "next/server";

const PYTHON_API_URL = process.env.PYTHON_API_URL || "http://localhost:8000";

export async function POST(req: NextRequest) {
  try {
    const incomingFormData = await req.formData();

    const file = incomingFormData.get("file") as File | null;
    const config = incomingFormData.get("config") as string | null;
    const fileType = (incomingFormData.get("fileType") as string) || "csv";
    const target = (incomingFormData.get("target") as string) || "";

    if (!file || !config) {
      return NextResponse.json(
        { error: "file and config are required" },
        { status: 400 }
      );
    }

    // Build FormData to forward to Python service
    const fd = new FormData();
    fd.set("config", config);
    fd.set("fileType", fileType);
    if (target) fd.set("target", target);
    fd.set("file", file);

    const res = await fetch(`${PYTHON_API_URL}/build-pipeline`, {
      method: "POST",
      body: fd,
    });

    if (!res.ok) {
      const text = await res.text();
      return NextResponse.json(
        { error: "Python service error", detail: text },
        { status: 500 }
      );
    }

    const data = await res.json();
    return NextResponse.json(data);
  } catch (err: any) {
    console.error(err);
    return NextResponse.json(
      { error: "Unexpected server error", detail: String(err) },
      { status: 500 }
    );
  }
}
