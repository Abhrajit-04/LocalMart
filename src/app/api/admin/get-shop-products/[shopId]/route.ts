import { auth } from "@/auth";
import connectDb from "@/lib/db";
import Grocery from "@/models/grocery.model";
import { NextResponse } from "next/server";

export async function GET(
  req: Request,
  { params }: { params: Promise<{ shopId: string }> }
) {
  try {
    await connectDb();

    const session = await auth();

    if (session?.user?.role !== "superadmin") {
      return NextResponse.json(
        { message: "Unauthorized" },
        { status: 401 }
      );
    }

    const { shopId } = await params;

    const groceries = await Grocery.find({
      shopId,
    }).sort({
      createdAt: -1,
    });

    return NextResponse.json(groceries);
  } catch (error) {
    return NextResponse.json(
      {
        message: `Get shop products error: ${error}`,
      },
      {
        status: 500,
      }
    );
  }
}