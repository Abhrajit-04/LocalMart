import { auth } from "@/auth";
import connectDb from "@/lib/db";
import Order from "@/models/order.model";
import Shop from "@/models/shop.model";
import User from "@/models/user.model";
import { NextRequest, NextResponse } from "next/server";

interface Props {
  params: Promise<{
    orderId: string;
  }>;
}

export async function GET(
  req: NextRequest,
  { params }: Props
) {
  try {
    await connectDb();

    const session = await auth();

    if (session?.user?.role !== "shopowner") {
      return NextResponse.json(
        { message: "Unauthorized" },
        { status: 401 }
      );
    }

    const { orderId } = await params;

    const shop = await Shop.findOne({
      ownerId: session.user.id,
    });

    if (!shop) {
      return NextResponse.json(
        { message: "Shop not found" },
        { status: 404 }
      );
    }

    const order = await Order.findById(orderId)
      .populate("user assignedDeliveryBoy");

    if (!order) {
      return NextResponse.json(
        { message: "Order not found" },
        { status: 404 }
      );
    }

    const belongsToShop = order.items.some(
      (item: any) =>
        item.shopId.toString() === shop._id.toString()
    );

    if (!belongsToShop) {
      return NextResponse.json(
        { message: "Unauthorized" },
        { status: 403 }
      );
    }

    const deliveryBoys = await User.find({
      role: "deliveryboy",
      isActive: true,
    });

    return NextResponse.json({
      order,
      deliveryBoys,
    });

  } catch (error) {

    return NextResponse.json(
      {
        message: `Get order error ${error}`,
      },
      {
        status: 500,
      }
    );

  }
}