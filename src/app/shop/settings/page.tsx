import { auth } from "@/auth";
import connectDb from "@/lib/db";
import Shop from "@/models/shop.model";
import { redirect } from "next/navigation";
import ShopSettings from "@/components/ShopSettings";

export default async function Page(){

await connectDb();

const session=await auth();

if(!session?.user){

redirect("/login");

}

const shop=await Shop.findOne({

ownerId:session.user.id

}).lean();

if(!shop){

redirect("/shop/register");

}

return(

<ShopSettings
shop={JSON.parse(JSON.stringify(shop))}
/>

)

}