import connectDb from "@/lib/db";
import Shop from "@/models/shop.model";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    await connectDb();

    const shops = await Shop.find({
      status: "approved",
      isActive: true,
    }).sort({
      createdAt: -1,
    });

    return NextResponse.json(shops, {
      status: 200,
    });
  } catch (error) {
    return NextResponse.json(
      {
        message: `Get approved shops error: ${error}`,
      },
      {
        status: 500,
      }
    );
  }
}