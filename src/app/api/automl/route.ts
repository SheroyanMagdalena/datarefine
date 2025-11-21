import { NextResponse } from "next/server";
import { spawn } from "child_process";
import path from "path";
import fs from "fs";

export const runtime = "nodejs"; // needed so we can use fs/child_process

export async function POST(req: Request) {
  try {
    const userInput = await req.json();

    // Path to builder.py inside src/python
    const builderPath = path.join(process.cwd(), "src", "python", "builder.py");

    // Make sure pipelines folder exists
    const pipelinesDir = path.join(process.cwd(), "src", "pipelines");
    if (!fs.existsSync(pipelinesDir)) {
      fs.mkdirSync(pipelinesDir, { recursive: true });
    }

    const outputScript = path.join(pipelinesDir, "generated_pipeline.py");

    return new Promise((resolve) => {
      const py = spawn("python3", [
        builderPath,
        JSON.stringify(userInput),
        outputScript,
      ]);

      let stderr = "";

      py.stderr.on("data", (data) => {
        stderr += data.toString();
      });

      py.on("close", (code) => {
        if (code !== 0) {
          console.error("Python error:", stderr);
          resolve(
            NextResponse.json(
              { success: false, error: stderr },
              { status: 500 }
            )
          );
        } else {
          resolve(
            NextResponse.json({
              success: true,
              outputScript,
            })
          );
        }
      });
    });
  } catch (error) {
    console.error("API Error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to generate pipeline" },
      { status: 500 }
    );
  }
}
