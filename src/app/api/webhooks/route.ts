import { NextRequest, NextResponse } from "next/server";
import { verifyWebhook } from "@clerk/nextjs/webhooks";
import { createOrUpdateUser, deleteUser } from "@/lib/actions/user";

export async function POST(req: NextRequest) {
  try {
    const event = await verifyWebhook(req);

    console.log("Verified Clerk Webhook:", event);


    // Now `event.data` contains the payload
    // `event.type` contains event type like "user.created" or "user.updated" or user.deleted"
    if (event.type === "user.created" || event.type === "user.updated") {
      const { id, email_addresses, first_name, last_name, username, image_url } = event.data;
      try{
         await createOrUpdateUser(
        id,
        first_name,
        last_name,
        image_url,
        email_addresses,
        username
      );
      return new Response('User is created or updated', {
        status: 200,
      });

      } catch(err){
        console.error("Error processing user data:", err);
        return NextResponse.json({ error: "Error processing user data" }, { status: 500 });

      }
    }

     if (event.type === 'user.deleted') {
    const { id } = event.data;
    try {
      await deleteUser(id);
      return new Response('User is deleted', {
        status: 200,
      });
    } catch (error) {
      console.log('Error deleting user:', error);
      return new Response('Error occurred', {
        status: 400,
      });
    }
  }

    return NextResponse.json({ message: "Webhook received" }, { status: 200 });
  } catch (error) {
    console.error("Webhook Error:", error);
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }
}
