import { auth } from "@/auth";
import connectDb from "@/lib/db";
import Grocery from "@/models/grocery.model";
import { NextResponse } from "next/server";

interface Props {
  params: Promise<{
    groceryId: string;
  }>;
}

export async function POST(
  req: Request,
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

    const product =
      await Grocery.findById(groceryId);

    if (!product) {

      return NextResponse.json(
        {
          message: "Product not found",
        },
        {
          status:404,
        }
      );

    }

    product.isAvailable =
      !product.isAvailable;

    await product.save();

    return NextResponse.json({

      success:true,

      message:
      product.isAvailable
      ? "Product Enabled"
      : "Product Disabled",

      product

    });

  } catch(error){

    return NextResponse.json(
      {
        message:`${error}`
      },
      {
        status:500
      }
    );

  }

}