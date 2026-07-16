import { auth } from "@/auth";
import connectDb from "@/lib/db";
import Grocery from "@/models/grocery.model";
import { NextRequest, NextResponse } from "next/server";

interface Props {
  params: Promise<{
    groceryId: string;
  }>;
}

export async function PUT(
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

    const { groceryId } = await params;

    const body = await req.json();

    const grocery = await Grocery.findById(groceryId);

    if (!grocery) {
      return NextResponse.json(
        {
          message: "Product not found",
        },
        {
          status: 404,
        }
      );
    }

    grocery.name = body.name;
    grocery.price = Number(body.price);
    grocery.stock = Number(body.stock);
    grocery.category = body.category;
    grocery.unit = body.unit;
    grocery.isAvailable = body.isAvailable;

    await grocery.save();

    return NextResponse.json(
      {
        success: true,
        message: "Product updated successfully.",
        grocery,
      },
      {
        status: 200,
      }
    );
  } catch (error) {
    return NextResponse.json(
      {
        message: `Update grocery error ${error}`,
      },
      {
        status: 500,
      }
    );
  }
}