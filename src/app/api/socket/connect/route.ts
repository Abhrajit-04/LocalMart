import connectDb from "@/lib/db"
import User from "@/models/user.model"
import mongoose from "mongoose"
import { NextRequest, NextResponse } from "next/server"

export async function POST(req: NextRequest) {
  try {
    await connectDb()

    const { userId, socketId } = await req.json()

    console.log("USER ID RECEIVED:", userId) // 🔍 DEBUG

    const user = await User.findByIdAndUpdate(
      new mongoose.Types.ObjectId(userId), // ✅ FIX HERE
      {
        socketId,
        isOnline: true
      },
      { returnDocument: "after" }
    )

    console.log("UPDATED USER:", user) // 🔍 DEBUG

    if (!user) {
      return NextResponse.json({ message: "user not found" }, { status: 400 })
    }

    return NextResponse.json({ success: true }, { status: 200 })

  } catch (error: any) {
    console.log("❌ ERROR:", error.message)
    return NextResponse.json({ success: false }, { status: 500 })
  }
}