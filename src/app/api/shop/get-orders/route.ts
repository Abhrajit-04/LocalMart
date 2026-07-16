import { auth } from "@/auth";
import connectDb from "@/lib/db";
import Order from "@/models/order.model";
import Shop from "@/models/shop.model";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    await connectDb();

    const session = await auth();

    if (session?.user?.role !== "shopowner") {
      return NextResponse.json(
        { message: "Unauthorized" },
        { status: 401 }
      );
    }

    const shop = await Shop.findOne({
      ownerId: session.user.id,
    });

    if (!shop) {
      return NextResponse.json(
        { message: "Shop not found" },
        { status: 404 }
      );
    }

    const orders = await Order.find({
      "items.shopId": shop._id,
    })
      .populate("user assignedDeliveryBoy")
      .sort({
        createdAt: -1,
      });

    return NextResponse.json(orders);

  } catch (error) {

    return NextResponse.json(
      {
        message: `Get shop orders error ${error}`,
      },
      {
        status: 500,
      }
    );

  }
}