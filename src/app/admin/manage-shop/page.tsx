"use client";

import { useEffect, useState } from "react";
import axios from "axios";

import mongoose from "mongoose";
import Image from "next/image";

interface IShop {
  _id: mongoose.Types.ObjectId;

  shopName: string;

  ownerName: string;

  email: string;

  mobile: string;

  category: string;

  address: string;

  status: string;

  shopImage: string;

  isActive: boolean;

  rating: number;
}

export default function ManageShops() {
  const [shops, setShops] = useState<IShop[]>([]);

  const [search, setSearch] = useState("");

  const handleApprove = async (shopId: string) => {
  try {
    const result = await axios.post(
      `/api/admin/approve-shop/${shopId}`
    );

    alert(result.data.message);

    setShops((prev) =>
      prev.map((shop) =>
        shop._id.toString() === shopId
          ? {
              ...shop,
              status: "approved",
              isActive: true,
            }
          : shop
      )
    );
  } catch (error: any) {
    alert(
      error?.response?.data?.message ||
        "Something went wrong"
    );
  }
};

const handleReject = async (shopId: string) => {
  try {
    const result = await axios.post(
      `/api/admin/reject-shop/${shopId}`
    );

    alert(result.data.message);

    setShops((prev) =>
      prev.map((shop) =>
        shop._id.toString() === shopId
          ? {
              ...shop,
              status: "rejected",
              isActive: false,
            }
          : shop
      )
    );
  } catch (error: any) {
    alert(
      error.response?.data?.message ||
      "Something went wrong"
    );
  }
};

  useEffect(() => {
    const getShops = async () => {
      try {
        const result = await axios.get("/api/admin/get-shops");

        console.log(result.data);

        setShops(result.data);
      } catch (error) {
        console.log(error);
      }
    };

    getShops();
  }, []);

  const filteredShops = shops.filter(
  (shop) =>
    shop.shopName
      .toLowerCase()
      .includes(search.toLowerCase()) ||

    shop.ownerName
      .toLowerCase()
      .includes(search.toLowerCase())
);

  return (
  <div className="min-h-screen bg-gray-100 p-10">

    <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6 mb-8">

  <div>

    <h1 className="text-5xl font-black text-gray-900">
      Manage Shops
    </h1>

    <p className="text-gray-500 mt-2">
      Review, approve and monitor all registered stores.
    </p>

  </div>

</div>

    <div className="mb-8">

  <input
    type="text"
    placeholder="Search by shop or owner..."
    value={search}
    onChange={(e) => setSearch(e.target.value)}
    className="w-full lg:w-[420px]
      rounded-2xl
      border
      border-gray-200
      bg-white
      px-6
      py-4
      shadow-sm
      focus:outline-none
      focus:ring-2
      focus:ring-green-500"
  />

</div>

   <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-8">

      {filteredShops.map((shop) => (

        <div
          key={shop._id.toString()}
          className="bg-white
rounded-3xl
border
border-gray-100
shadow-md
p-6
hover:shadow-2xl
hover:-translate-y-2
transition-all
duration-300"
        >

          <Image
  src={shop.shopImage}
  alt={shop.shopName}
  width={500}
  height={300}
  className="w-full h-60 object-cover rounded-xl"
/>

          <div className="mt-4">

  <h2 className="text-xl font-bold">
    {shop.shopName}
  </h2>

  <p className="text-gray-600">
    👤 {shop.ownerName}
  </p>

  <p className="text-gray-600">
    📧 {shop.email}
  </p>

  <p className="text-gray-600">
    📱 {shop.mobile}
  </p>

  <p className="text-gray-600">
    🏪 {shop.category}
  </p>

  <p className="text-gray-600">
    📍 {shop.address}
  </p>

  <div className="mt-2">
  {shop.rating > 0 ? (
    <p className="text-gray-600">
      ⭐ {shop.rating.toFixed(1)}
    </p>
  ) : (
    <p className="text-gray-400">
      No ratings yet
    </p>
  )}
</div>

  <div className="mt-4">
    <span
      className={`px-3 py-1 rounded-full text-sm font-semibold
      ${
        shop.status === "approved"
          ? "bg-green-100 text-green-700"
          : shop.status === "pending"
          ? "bg-yellow-100 text-yellow-700"
          : "bg-red-100 text-red-700"
      }`}
    >
      {shop.status.toUpperCase()}
    </span>
  </div>

  <div className="flex gap-3 mt-5">
{shop.status === "pending" && (
  <button
  onClick={() => handleApprove(shop._id.toString())}
  className="flex-1 bg-green-600 hover:bg-green-700 text-white py-3
rounded-2xl
font-semibold"
>
  Approve
</button>
)}

{shop.status === "pending" && (
  <button
    className="flex-1 bg-red-600 hover:bg-red-700 text-white py-3
rounded-2xl
font-semibold"
  >
    Reject
  </button>
)}

</div>

</div>

        </div>

      ))}

    </div>

    {filteredShops.length === 0 && (
  <div className="text-center py-20">
    <h2 className="text-2xl font-bold">
      No shops found
    </h2>

    <p className="text-gray-500 mt-2">
      Try another search.
    </p>
  </div>
)}

  </div>
);
}