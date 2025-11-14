import { NextRequest, NextResponse } from "next/server";
import { verifyWebhook } from "@clerk/nextjs/webhooks";
import { createOrUpdateUser, deleteUser } from "@/lib/actions/user";

export async function POST(req: NextRequest) {
  try {
    const event = await verifyWebhook(req);

    console.log("Verified Clerk Webhook:", event);




    return NextResponse.json({ message: "Webhook received" }, { status: 200 });
  } catch (error) {
    console.error("Webhook Error:", error);
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }
}
