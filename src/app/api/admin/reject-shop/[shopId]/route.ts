import { auth } from "@/auth";
import connectDb from "@/lib/db";
import Shop from "@/models/shop.model";
import User from "@/models/user.model";
import { NextRequest, NextResponse } from "next/server";

export async function POST(
    req: NextRequest,
    {
        params,
    }: {
        params: Promise<{
            shopId: string;
        }>;
    }
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
const { shopId } = await params;

const shop = await Shop.findById(shopId);

if (!shop) {
  return NextResponse.json(
    {
      message: "Shop not found",
    },
    {
      status: 404,
    }
  );
}

if (shop.status === "rejected") {
  return NextResponse.json(
    {
      success: false,
      message: "Shop is already rejected.",
    },
    {
      status: 400,
    }
  );
}
shop.status = "rejected";
shop.isActive = false;

await shop.save();

const owner = await User.findById(shop.ownerId);

if (owner) {

    owner.role = "user";

    await owner.save();

}

return NextResponse.json(
  {
    success: true,
    message: "Shop rejected successfully.",
    shop,
  },
  {
    status: 200,
  }
);

} catch (error) {

    console.log(error);

    return NextResponse.json(
        {
            message: "Internal Server Error",
        },
        {
            status: 500,
        }
    );

}

}