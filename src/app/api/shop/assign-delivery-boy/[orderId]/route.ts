import { auth } from "@/auth";
import connectDb from "@/lib/db";
import Order from "@/models/order.model";
import Shop from "@/models/shop.model";
import User from "@/models/user.model";
import { NextRequest, NextResponse } from "next/server";
import DeliveryAssignment from "@/models/deliveryAssignment.model";
import emitEventHandler from "@/lib/emitEventHandler";


interface Props {
  params: Promise<{
    orderId: string;
  }>;
}

export async function POST(
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

    const { deliveryBoyId } = await req.json();

    const shop = await Shop.findOne({
      ownerId: session.user.id,
    });

    if (!shop) {
      return NextResponse.json(
        { message: "Shop not found" },
        { status: 404 }
      );
    }

    const order = await Order.findById(orderId);

if (!order) {
  return NextResponse.json(
    { message: "Order not found" },
    { status: 404 }
  );
}

if (order.assignedDeliveryBoy) {
  return NextResponse.json(
    {
      message: "Order is already assigned.",
    },
    {
      status: 400,
    }
  );
}

    const deliveryBoy = await User.findOne({
      _id: deliveryBoyId,
      role: "deliveryboy",
      isActive: true,
    });

    if (!deliveryBoy) {
      return NextResponse.json(
        { message: "Delivery Boy not found" },
        { status: 404 }
      );
    }

    const existingAssignment = await DeliveryAssignment.findOne({
  order: order._id,
});

if (existingAssignment) {
  return NextResponse.json(
    {
      message: "Delivery assignment already exists.",
    },
    {
      status: 400,
    }
  );
}

order.assignedDeliveryBoy = deliveryBoy._id;
order.assignment = deliveryBoy._id;

await order.save();

await DeliveryAssignment.create({
  order: order._id,
  brodcastedTo: [deliveryBoy._id],
  assignedTo: null,
  status: "brodcasted",
});

// Notify delivery boy
if (deliveryBoy.socketId) {

  await emitEventHandler(
    "new-assignment",
    {
      orderId: order._id,
    },
    deliveryBoy.socketId
  );

}

// 🔥 Notify all admins to refresh orders
await emitEventHandler(
  "admin-order-updated",
  {
    orderId: order._id,
    status: "assigned",
    deliveryBoy: deliveryBoy.name,
  }
);

    return NextResponse.json(
      {
        success: true,
        message: "Delivery boy assigned successfully.",
      },
      {
        status: 200,
      }
    );

  } catch (error) {

    return NextResponse.json(
      {
        message: `Assign delivery boy error : ${error}`,
      },
      {
        status: 500,
      }
    );

  }
}