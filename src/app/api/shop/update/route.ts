import { auth } from "@/auth";
import connectDb from "@/lib/db";
import Shop from "@/models/shop.model";
import { NextRequest, NextResponse } from "next/server";
import emitEventHandler from "@/lib/emitEventHandler";

export async function POST(req: NextRequest) {
  try {
    await connectDb();

    const session = await auth();

    if (session?.user?.role !== "shopowner") {
      return NextResponse.json(
        { message: "Unauthorized" },
        { status: 401 }
      );
    }

    const body = await req.json();

    const shop = await Shop.findOne({
      ownerId: session.user.id,
    });

    if (!shop) {
      return NextResponse.json(
        { message: "Shop not found" },
        { status: 404 }
      );
    }

    shop.shopName = body.shopName;
    shop.openingTime = body.openingTime;
    shop.closingTime = body.closingTime;
    shop.deliveryRadius = body.deliveryRadius;
    shop.isOpen = body.isOpen;

    await shop.save();

    await emitEventHandler(
  "shop-updated",
  {
    shopId: shop._id,
    shopName: shop.shopName,
    isOpen: shop.isOpen,
  }
);

    return NextResponse.json({
      success: true,
      message: "Shop updated successfully",
    });

  } catch (error) {

    return NextResponse.json(
      {
        message: `Update shop error ${error}`,
      },
      {
        status: 500,
      }
    );

  }
}