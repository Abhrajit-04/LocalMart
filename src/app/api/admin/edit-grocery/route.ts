import { auth } from "@/auth";
import uploadOnCloudinary from "@/lib/cloudinary";
import connectDb from "@/lib/db";
import Grocery from "@/models/grocery.model";
import Shop from "@/models/shop.model";
import { NextRequest,NextResponse } from "next/server";

export async function POST(req:NextRequest){
    try {
        await connectDb()
        const session=await auth()
        if (session?.user?.role != "shopowner") {
            return NextResponse.json({message:"Unauthorized"},{status:400})

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
            const formData=await req.formData()
            const name=formData.get("name") as string
            const groceryId=formData.get("groceryId") as string
            const category = formData.get("category") as string;
const unit = formData.get("unit") as string;
const price = formData.get("price") as string;

const stock = formData.get("stock") as string;
const isAvailable = formData.get("isAvailable") as string;

const file = formData.get("image") as Blob | null;
            let imageUrl = "";

if (file) {
    imageUrl = (await uploadOnCloudinary(file)) ?? "";
}



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

            grocery.name = name;
grocery.category = category;
grocery.unit = unit;
grocery.price = Number(price);

grocery.stock = Number(stock);

grocery.isAvailable = isAvailable === "true";

if (imageUrl) {
    grocery.image = imageUrl;
}

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
        return NextResponse.json({message:`edit grocery error ${error}`},{status:500})
    }
}