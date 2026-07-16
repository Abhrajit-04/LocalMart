import { auth } from "@/auth";
import connectDb from "@/lib/db";
import Grocery from "@/models/grocery.model";
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

    const products = await Grocery.countDocuments({
      shopId: shop._id,
    });

    const orders = await Order.find({
      "items.shopId": shop._id,
    });

    const totalOrders = orders.length;

    const revenue = orders.reduce(
  (sum, order) => sum + order.totalAmount,
  0
);

    return NextResponse.json({
      products,
      totalOrders,
      revenue,
      rating: shop.rating,
    });

  } catch (error) {
    return NextResponse.json(
      {
        message: `Dashboard error ${error}`,
      },
      {
        status: 500,
      }
    );
  }
}