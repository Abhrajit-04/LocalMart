import { auth } from "@/auth";
import connectDb from "@/lib/db";
import User from "@/models/user.model";
import { NextRequest, NextResponse } from "next/server";

interface Props {
  params: Promise<{
    deliveryBoyId: string;
  }>;
}

export async function POST(
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

    const deliveryBoy =
      await User.findById(deliveryBoyId);

    if (!deliveryBoy) {
      return NextResponse.json(
        {
          message: "Delivery boy not found.",
        },
        {
          status: 404,
        }
      );
    }

    deliveryBoy.isActive =
      !deliveryBoy.isActive;

    await deliveryBoy.save();

    return NextResponse.json(
      {
        success: true,
        message: deliveryBoy.isActive
          ? "Delivery boy activated."
          : "Delivery boy suspended.",
      },
      {
        status: 200,
      }
    );

  } catch (error) {

    return NextResponse.json(
      {
        message: `Suspend delivery boy error ${error}`,
      },
      {
        status: 500,
      }
    );

  }
}