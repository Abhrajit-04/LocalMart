import connectDb from "@/lib/db";
import Order from "@/models/order.model";
import User from "@/models/user.model";
import Grocery from "@/models/grocery.model";
import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";

const stripe=new Stripe(process.env.STRIPE_SECRET_KEY!)


export async function POST(req:NextRequest){
    try {
        await connectDb()
        const {userId,items,paymentMethod,totalAmount,address}=await req.json()
        if(!items||!userId||!paymentMethod||!totalAmount||!address){
            return NextResponse.json(
                {message:"please send all credentials"},
                {status:400}
            )
        }
        const user=await User.findById(userId)
        if(!user){
            return NextResponse.json(
                {message:"user not found"},
                {status:400}
            )
        }

        const updatedItems = await Promise.all(
  items.map(async (item: any) => {
    const grocery = await Grocery.findById(item.grocery);

    if (!grocery) {
      throw new Error("Product not found");
    }

    return {
      ...item,
      shopId: grocery.shopId,
    };
  })
);

        const newOrder=await Order.create({
            user:userId,
            items: updatedItems,
            paymentMethod,
            totalAmount,
            address
        })

        const session=await stripe.checkout.sessions.create({
            payment_method_types:["card","upi"],
            mode:"payment",
            success_url:`${process.env.NEXTAUTH_URL}/user/order-success`,
            cancel_url:`${process.env.NEXTAUTH_URL}/user/order-cancel`,
            line_items: [{
      price_data: {
        currency: 'inr',
        product_data: {
          name: 'LoKart Order Payment',
        },
        unit_amount:totalAmount*100,
      },
      quantity: 1,
    },

],
metadata:{orderId:newOrder._id.toString()},
        })
        return NextResponse.json({url:session.url},{status:200})
    } catch (error) {
        
            return NextResponse.json(
                {message:`order payment error ${error}`},
                {status:500}
            )
        

    }
}