import { NextRequest, NextResponse } from "next/server";
import { verifyWebhook } from "@clerk/nextjs/webhooks";
import { createOrUpdateUser, deleteUser } from "@/lib/actions/user";

export async function POST(req: NextRequest) {
  try {
    const event = await verifyWebhook(req);

    console.log("Verified Clerk Webhook:", event);

    const eventType = event.type;
    console.log(`Received webhook type: ${eventType}`);
    console.log("Payload:", event.data);

    if (eventType === "user.created" || eventType === "user.updated") {
      const {
        id,
        email_addresses,
        first_name,
        last_name,
        username,
        image_url,
      } = event.data;

      try {
        await createOrUpdateUser(
          id,
          first_name,
          last_name,
          image_url,
          email_addresses,
          username
        );

        return NextResponse.json(
          { message: "User created or updated" },
          { status: 200 }
        );
      } catch (err) {
        console.error("Error processing user data:", err);
        return NextResponse.json(
          { error: "Error processing user data" },
          { status: 500 }
        );
      }
    }

    if (eventType === "user.deleted") {
      try {
        await deleteUser(event.data.id);

        return NextResponse.json(
          { message: "User deleted" },
          { status: 200 }
        );
      } catch (error) {
        console.error("Error deleting user:", error);
        return NextResponse.json(
          { error: "Failed to delete user" },
          { status: 500 }
        );
      }
    }

    return NextResponse.json(
      { message: "Webhook received (ignored event type)" },
      { status: 200 }
    );

  } catch (error) {
    console.error("Webhook Error:", error);
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }
}
