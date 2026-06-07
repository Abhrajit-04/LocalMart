import connectDb from "@/lib/db"

import Message from "@/models/message.model"
import Order from "@/models/order.model"
import { NextRequest, NextResponse } from "next/server"

export async function POST(req: NextRequest) {
  try {
    await connectDb()

    const { senderId, text, roomId, time } = await req.json()

    console.log("SAVE MESSAGE DATA:", {
      senderId,
      text,
      roomId,
      time,
    })

    const room = await Order.findById(roomId)

    if (!room) {
      console.log("ROOM NOT FOUND:", roomId)

      return NextResponse.json(
        { message: "room not found" },
        { status: 400 }
      )
    }

    const message = await Message.create({
      senderId,
      text,
      roomId,
      time,
    })

    console.log("MESSAGE SAVED:", message)

    return NextResponse.json(message, { status: 200 })

  } catch (error) {
    console.log("SAVE MESSAGE ERROR:", error)

    return NextResponse.json(
      { message: `save message error ${error}` },
      { status: 500 }
    )
  }
}