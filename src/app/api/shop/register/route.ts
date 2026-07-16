import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import connectDb from "@/lib/db";
import User from "@/models/user.model";
import Shop from "@/models/shop.model";
import uploadOnCloudinary from "@/lib/cloudinary";
export async function POST(req: NextRequest) {

  try {

    await connectDb();

    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json(
        {
          success: false,
          message: "Please login first.",
        },
        {
          status: 401,
        }
      );
    }

    const formData = await req.formData();

const shopName = formData.get("shopName") as string;

const category = formData.get("category") as string;

const address = formData.get("address") as string;

const latitude = formData.get("latitude") as string;

const longitude = formData.get("longitude") as string;

const deliveryRadius = formData.get("deliveryRadius") as string;

const openingTime = formData.get("openingTime") as string;

const closingTime = formData.get("closingTime") as string;

const shopImage = formData.get("shopImage") as Blob | null;

if (
  !shopName ||
  !category ||
  !address ||
  !latitude ||
  !longitude
) {
  return NextResponse.json(
    {
      success: false,
      message: "Please fill all required fields.",
    },
    {
      status: 400,
    }
  );
}

let shopImageUrl = "";

if (shopImage) {
  // uploadOnCloudinary may return string | null — coalesce to empty string
  shopImageUrl = (await uploadOnCloudinary(shopImage)) ?? "";
}

const user = await User.findById(session.user.id);

if (!user) {
  return NextResponse.json(
    {
      success: false,
      message: "User not found.",
    },
    {
      status: 404,
    }
  );
}

const alreadyRegistered = await Shop.findOne({
  ownerId: user._id,
});

if (alreadyRegistered) {
  return NextResponse.json(
    {
      success: false,
      message: "You already have a registered shop.",
    },
    {
      status: 400,
    }
  );
}

    const shop = await Shop.create({
  ownerId: user._id,

  shopName,

  ownerName: user.name,

  email: user.email,

  mobile: user.mobile ?? "",

  category,

  address,

  location: {
    type: "Point",
    coordinates: [
      Number(longitude),
      Number(latitude),
    ],
  },

  deliveryRadius: Number(deliveryRadius) * 1000,

  openingTime,

  closingTime,

  shopImage: shopImageUrl,

  status: "pending",

  isActive: false,

  isOpen: true,

  rating: 0,
});



return NextResponse.json(
  {
    success: true,
    message: "Shop registered successfully.",
    shop,
  },
  {
    status: 201,
  }
);

  } catch (error) {

    console.error(error);

    return NextResponse.json(
      {
        success: false,
        message: "Internal Server Error",
      },
      {
        status: 500,
      }
    );

  }

}