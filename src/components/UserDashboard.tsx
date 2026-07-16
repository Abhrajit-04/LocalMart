"use client";

import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
import { getSocket } from "@/lib/socket";
import HeroSection from "./HeroSection";
import CategorySlider from "./CategorySlider";
import { IShop } from "@/models/shop.model";
import ShopCard from "./ShopCard";

function UserDashboard({ shopList }: { shopList: IShop[] }) {
  const router = useRouter();
 const plainShopList = JSON.parse(JSON.stringify(shopList));

 useEffect(() => {

  const socket = getSocket();

  const handleShopUpdated = () => {
    router.refresh();
  };

  socket.on("shop-updated", handleShopUpdated);

  return () => {
    socket.off("shop-updated", handleShopUpdated);
  };

}, [router]);
  

  return (
    <>
      <HeroSection />
      <CategorySlider />
      <div
  id="products"
  className="w-[92%] md:w-[85%] mx-auto mt-16 scroll-mt-28"
>
        <h2 className="text-2xl md:text-3xl font-bold text-center mb-2
bg-gradient-to-r from-green-700 via-emerald-600 to-green-800
bg-clip-text text-transparent
drop-shadow-[0_2px_6px_rgba(16,185,129,0.35)]">
  Nearby Shops
</h2>

<p className="text-center text-emerald-800/70 mb-8 text-sm tracking-wide">
 Choose a nearby shop to start shopping
</p>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6">
          {plainShopList.map((shop: any) => (
  <ShopCard
    key={shop._id}
    shop={shop}
  />
))}
        </div>
      </div>
    </>
  );
}

export default UserDashboard;
