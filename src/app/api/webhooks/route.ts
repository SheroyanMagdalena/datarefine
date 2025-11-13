import { NextRequest, NextResponse } from "next/server";
import { verifyWebhook } from "@clerk/nextjs/webhooks";

export async function POST(req: NextRequest) {
  try {
    // ✅ Let Clerk handle body + header verification
    const event = await verifyWebhook(req);

    console.log("Verified Clerk Webhook:", event);

    // Now `event.data` contains the payload
    // `event.type` contains event type like "user.created" or "user.updated"
    switch (event.type) {
      case "user.created":
        console.log("User created:", event.data.id);
        // e.g. create user in DB here
        break;

      case "user.updated":
        console.log("User updated:", event.data.id);
        // e.g. sync user record
        break;

      case "user.deleted":
        console.log("User deleted:", event.data.id);
        // e.g. soft-delete user in DB
        break;

      default:
        console.log("Unhandled event type:", event.type);
    }

    return NextResponse.json({ message: "Webhook received" }, { status: 200 });
  } catch (error) {
    console.error("Webhook Error:", error);
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }
}
