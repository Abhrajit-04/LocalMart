import React from "react";
import HeroSection from "./HeroSection";
import CategorySlider from "./CategorySlider";
import connectDb from "@/lib/db";
import Grocery from "@/models/grocery.model";
import GroceryItemCard from "./GroceryItemCard";

async function UserDashboard() {
  await connectDb();
  const groceries = await Grocery.find({});
  const plainGrocery = JSON.parse(JSON.stringify(groceries));

  return (
    <>
      <HeroSection />
      <CategorySlider />
      <div className="w-[92%] md:w-[85%] mx-auto mt-16">
        <h2 className="text-2xl md:text-3xl font-bold text-center mb-2
bg-gradient-to-r from-green-700 via-emerald-600 to-green-800
bg-clip-text text-transparent
drop-shadow-[0_2px_6px_rgba(16,185,129,0.35)]">
  Popular Items
</h2>

<p className="text-center text-emerald-800/70 mb-8 text-sm tracking-wide">
  Most loved products by our customers
</p>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6">
          {plainGrocery.map((item: any) => (
            <div
              key={item._id}
              className="group bg-white/70 backdrop-blur-md 
                border border-white/40 
              rounded-2xl 
              shadow-[0_10px_30px_rgba(16,185,129,0.15)] 
              hover:shadow-[0_15px_40px_rgba(16,185,129,0.25)]
              hover:-translate-y-1
              transition-all duration-300"
                          >
              <GroceryItemCard item={item} />
            </div>
          ))}
        </div>
      </div>
    </>
  );
}

export default UserDashboard;
