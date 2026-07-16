import { auth } from "@/auth";
import connectDb from "@/lib/db";
import Order from "@/models/order.model";
import User from "@/models/user.model";
import { NextRequest, NextResponse } from "next/server";

interface Props {
  params: Promise<{
    deliveryBoyId: string;
  }>;
}

export async function GET(
  req: NextRequest,
  { params }: Props
) {
  try {
    await connectDb();

    const session = await auth();

    if (session?.user?.role !== "superadmin") {
      return NextResponse.json(
        {
          message: "Unauthorized",
        },
        {
          status: 401,
        }
      );
    }

    const { deliveryBoyId } = await params;

    const deliveryBoy = await User.findById(deliveryBoyId);

    if (!deliveryBoy) {
      return NextResponse.json(
        {
          message: "Delivery Boy not found",
        },
        {
          status: 404,
        }
      );
    }

    const assignedOrders = await Order.find({
      assignedDeliveryBoy: deliveryBoyId,
    }).sort({
      createdAt: -1,
    });

    const completedOrders = assignedOrders.filter(
      (o) => o.status === "delivered"
    );

    const pendingOrders = assignedOrders.filter(
      (o) => o.status !== "delivered"
    );

    console.log(deliveryBoy);

    return NextResponse.json({
      deliveryBoy,
      assignedOrders,
      completedOrders,
      pendingOrders,
    });

  } catch (error) {

    return NextResponse.json(
      {
        message: `Get delivery boy error ${error}`,
      },
      {
        status: 500,
      }
    );

  }
}