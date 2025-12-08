import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { connect } from "@/lib/mongodb/mongoose";
import User from "@/lib/models/user.model";

export async function POST(req: Request) {
    try {
        // @ts-ignore
        const { userId } = auth();

        if (!userId) {
            return new NextResponse("Unauthorized", { status: 401 });
        }

        const body = await req.json();
        const { projectName } = body;

        if (!projectName || !projectName.trim()) {
            return new NextResponse("projectName is required", { status: 400 });
        }

        await connect();

        // @ts-ignore
        const user = await User.findOneAndUpdate(
            { clerkId: userId },
            { $set: { projectName: projectName.trim() } },
            { new: true }
        );

        if (!user) {
            return new NextResponse("User not found", { status: 404 });
        }

        return NextResponse.json({ user });
    } catch (err) {
        console.error("Error updating projectName:", err);
        return new NextResponse("Internal Server Error", { status: 500 });
    }
}
