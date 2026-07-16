import { auth } from "@/auth";
import connectDb from "@/lib/db";
import User from "@/models/user.model";
import { NextResponse } from "next/server";

export async function GET() {

    try{

        await connectDb();

        const session = await auth();

        if(session?.user?.role !== "shopowner"){

            return NextResponse.json(
                {message:"Unauthorized"},
                {status:401}
            );

        }

        const deliveryBoys = await User.find({
            role:"deliveryboy",
            isActive:true
        }).sort({
            createdAt:-1
        });

        return NextResponse.json(deliveryBoys);

    }catch(error){

        return NextResponse.json(
            {message:`Get delivery boys error ${error}`},
            {status:500}
        );

    }

}