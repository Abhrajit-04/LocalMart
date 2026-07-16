import connectDb from "@/lib/db";
import Shop from "@/models/shop.model";
import Grocery from "@/models/grocery.model";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, ShoppingCart } from "lucide-react";
import GroceryItemCard from "@/components/GroceryItemCard";
import mongoose from "mongoose";

interface Props {
  params: Promise<{
    shopId: string;
  }>;
}

export default async function ShopPage({ params }: Props) {
  await connectDb();

 const { shopId } = await params;

if (!mongoose.Types.ObjectId.isValid(shopId)) {
  notFound();
}

const shop = await Shop.findById(shopId);

if (!shop) {
  notFound();
}

  console.log("Current Shop ID:", shop._id.toString());

const groceries = await Grocery.find({
  shopId: shop._id,
});

console.log("Groceries Found:", groceries);

  return (

<div className="min-h-screen bg-gradient-to-b from-green-50 via-white to-gray-100">

<div className="max-w-7xl mx-auto px-6 py-6">

  <div className="
sticky
top-0
z-50
bg-white/80
backdrop-blur-xl
border
border-gray-200
rounded-3xl
shadow-md
mb-8
">

<div className="flex items-center justify-between px-6 py-4">

<div className="flex items-center gap-4">

<Link
href="/"
className="
w-11
h-11
rounded-xl
bg-green-100
hover:bg-green-200
flex
items-center
justify-center
transition">

<ArrowLeft className="text-green-700"/>

</Link>

<div>

<h1 className="text-3xl font-black">

{shop.shopName}

</h1>

<p className="text-gray-500 text-sm">

📍 {shop.address}

</p>

</div>

</div>

<Link
href="/user/cart"
className="
w-12
h-12
rounded-xl
bg-green-600
hover:bg-green-700
text-white
flex
items-center
justify-center
shadow-lg">

<ShoppingCart/>

</Link>

</div>

</div>
     

      <div className="flex gap-3 mt-4 flex-wrap">

  <span className="bg-green-100 text-green-700 px-4 py-2 rounded-full">
    🛒 {shop.category}
  </span>

  <span className="bg-yellow-100 text-yellow-700 px-4 py-2 rounded-full">
    ⭐ 4.8
  </span>

  <span className="bg-blue-100 text-blue-700 px-4 py-2 rounded-full">
    ⚡ 10–15 mins
  </span>

</div>

      <div className="mt-10">

  <div className="flex items-center justify-between mb-8">

<h2 className="text-3xl font-black">

Popular Products

</h2>

<p className="text-gray-500">

{groceries.length} Items

</p>

</div>

  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">

   {groceries.map((item: any) => (

  <div
    key={item._id}
    className="
   hover:-translate-y-2
hover:shadow-2xl
transition-all
duration-300"
  >

    <GroceryItemCard
      item={JSON.parse(JSON.stringify(item))}
    />

  </div>

))}
  </div>

</div>
    </div>
    </div>
  );
}