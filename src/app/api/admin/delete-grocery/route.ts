import { auth } from "@/auth";

import connectDb from "@/lib/db";
import Grocery from "@/models/grocery.model";
import Shop from "@/models/shop.model";
import { NextRequest,NextResponse } from "next/server";

export async function POST(req:NextRequest){
    try {
        await connectDb()
       const session = await auth();

if (session?.user?.role != "shopowner") {
    return NextResponse.json(
        {
            message: "Unauthorized",
        },
        {
            status: 400,
        }
    );
}

const shop = await Shop.findOne({
    ownerId: session.user.id,
});

if (!shop) {
    return NextResponse.json(
        {
            message: "Shop not found.",
        },
        {
            status: 404,
        }
    );
}
            const {groceryId}=await req.json()
            const grocery = await Grocery.findById(groceryId);

if (!grocery) {
    return NextResponse.json(
        {
            message: "Product not found.",
        },
        {
            status: 404,
        }
    );
}

if (grocery.shopId.toString() !== shop._id.toString()) {
    return NextResponse.json(
        {
            message: "Unauthorized.",
        },
        {
            status: 403,
        }
    );
}

await grocery.deleteOne();
            return NextResponse.json(
    {
        success: true,
        message: "Product deleted successfully.",
    },
    {
        status: 200,
    }
);
    } catch (error) {
        return NextResponse.json({message:`delete grocery error ${error}`},{status:500})
    }
}