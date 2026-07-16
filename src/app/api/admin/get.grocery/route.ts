import { auth } from "@/auth";
import connectDb from "@/lib/db";
import Grocery from "@/models/grocery.model";
import Shop from "@/models/shop.model";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    await connectDb();

    const session = await auth();

    if (session?.user?.role !== "shopowner") {
      return NextResponse.json(
        {
          message: "Unauthorized",
        },
        {
          status: 401,
        }
      );
    }

    const shop = await Shop.findOne({
      ownerId: session.user.id,
    });

    if (!shop) {
      return NextResponse.json(
        {
          message: "Shop not found.",
        },
        {
          status: 404,
        }
      );
    }

    const groceries = await Grocery.find({
      shopId: shop._id,
    }).sort({
      createdAt: -1,
    });

    return NextResponse.json(groceries, { status: 200 });

  } catch (error) {

    return NextResponse.json(
      {
        message: `get groceries error ${error}`,
      },
      {
        status: 500,
      }
    );

  }
}