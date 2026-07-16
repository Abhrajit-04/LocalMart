"use client";

import Image from "next/image";
import Link from "next/link";
import mongoose from "mongoose";

interface IShop {
  _id: mongoose.Types.ObjectId;
  shopName: string;
  category: string;
  address: string;
  shopImage: string;
  rating: number;
  isOpen: boolean;
}

export default function ShopCard({ shop }: { shop: IShop }) {
  return (
    <div className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition overflow-hidden">

      <Image
        src={shop.shopImage}
        alt={shop.shopName}
        width={500}
        height={300}
        className="w-full h-52 object-cover"
      />

      <div className="p-5">

        <div className="flex justify-between items-center">
          <h2 className="text-xl font-bold">
            {shop.shopName}
          </h2>

          <span className="bg-green-100 text-green-700 px-2 py-1 rounded-lg text-sm">
            ⭐ {shop.rating.toFixed(1)}
          </span>
        </div>

        <p className="text-gray-500 mt-2">
          {shop.category}
        </p>

        <p className="text-gray-500 text-sm mt-1">
          📍 {shop.address}
        </p>

        <div className="mt-4 flex justify-between items-center">

          <span
            className={`text-sm font-semibold ${
              shop.isOpen
                ? "text-green-600"
                : "text-red-600"
            }`}
          >
            {shop.isOpen ? "🟢 Open" : "🔴 Closed"}
          </span>

          <Link
            href={`/shop/${shop._id}`}
            className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-xl"
          >
            Visit Shop
          </Link>

        </div>

      </div>

    </div>
  );
}