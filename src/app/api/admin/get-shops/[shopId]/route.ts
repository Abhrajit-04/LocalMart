import { auth } from "@/auth";
import connectDb from "@/lib/db";
import Shop from "@/models/shop.model";
import { NextResponse } from "next/server";

export async function GET(
  req: Request,
  {
    params,
  }: {
    params: Promise<{ shopId: string }>;
  }
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

    const shop = await Shop.findById(shopId).populate("ownerId");

    if (!shop) {
      return NextResponse.json(
        { message: "Shop not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(shop);

  } catch (error) {
    return NextResponse.json(
      {
        message: `Get Shop Error ${error}`,
      },
      {
        status: 500,
      }
    );
  }
}