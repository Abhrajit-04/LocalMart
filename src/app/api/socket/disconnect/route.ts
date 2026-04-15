import connectDb from "@/lib/db";
import User from "@/models/user.model";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    await connectDb();

    const { socketId } = await req.json();

    if (!socketId) {
      return NextResponse.json(
        { message: "Socket ID required" },
        { status: 400 }
      );
    }

    // 🔥 Find user by socketId and update
    const user = await User.findOneAndUpdate(
  { socketId },
  {
    socketId: null,
    isOnline: false,
  },
  { returnDocument: "after" }
);

if (!user) {
  return NextResponse.json(
    { message: "User already offline" }, // ✅ better message
    { status: 200 } // ✅ avoid 400 error
  );
}

    return NextResponse.json(
      { success: true },
      { status: 200 }
    );

  } catch (error: any) {
    console.log("❌ DISCONNECT ERROR:", error);

    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}