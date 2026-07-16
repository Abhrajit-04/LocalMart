import { auth } from "@/auth";
import connectDb from "@/lib/db";
import Shop from "@/models/shop.model";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    await connectDb();

    const session = await auth();

    if (session?.user?.role !== "superadmin") {
      return NextResponse.json(
        { message: "Unauthorized" },
        { status: 401 }
      );
    }

    const shops = await Shop.find({})
      .populate("ownerId")
      .sort({ createdAt: -1 });

    return NextResponse.json(shops);
  } catch (error) {
    return NextResponse.json(
      { message: `Get shops error: ${error}` },
      { status: 500 }
    );
  }
}