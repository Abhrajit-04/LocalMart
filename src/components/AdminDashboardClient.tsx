"use client";
import Link from "next/link";
import React, { useState } from "react";
import { motion } from "motion/react";
import {
  IndianRupee,
  Package,
  Truck,
  Users,
  Store,
  ShoppingCart,
} from "lucide-react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
} from "recharts";

type propType = {
  earning: {
    today: number;
    sevenDays: number;
    total: number;
  };
  stats: {
    title: string;
    value: number;
  }[];
  chartData: {
    day: string;
    orders: number;
  }[];
  recentOrders: any[];
recentShops: any[];
pendingShops: number;
};

function AdminDashboardClient({
  earning,
  stats,
  chartData,
  recentOrders,
  recentShops,
  pendingShops,
}: propType) {
  const [filter, setFilter] = useState<"today" | "sevenDays" | "total">();
  const currentEarning =
    filter === "today"
      ? earning.today
      : filter === "sevenDays"
        ? earning.sevenDays
        : earning.total;

  const title =
    filter === "today"
      ? "Today's Earning"
      : filter === "sevenDays"
        ? "Last 7 Days Earning"
        : "Total Earning";
  return (
    <div className="pt-28 w-[92%] lg:w-[85%] mx-auto">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6 mb-10 text-center md:text-left">
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-4xl md:text-5xl font-extrabold drop-shadow-sm"
        >
          <span>🏪 </span>

          <span className="bg-gradient-to-r from-green-700 via-emerald-500 to-green-400 bg-clip-text text-transparent">
            Admin Dashboard
          </span>
        </motion.h1>

        <select
          className="w-full md:w-auto px-5 py-3 rounded-2xl bg-white/80 backdrop-blur-md border border-green-100 shadow-lg text-gray-700 font-medium focus:ring-2 focus:ring-green-500 focus:outline-none transition-all duration-300"
          onChange={(e) => setFilter(e.target.value as any)}
          value={filter}
        >
          <option value="total">Total</option>
          <option value="sevenDays">Last 7 Days</option>
          <option value="today">Today</option>
        </select>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 25, scale: 0.96 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{
          duration: 0.5,
          ease: "easeOut",
        }}
        whileHover={{
          y: -4,
          scale: 1.01,
        }}
        className="
    relative
    overflow-hidden
    rounded-3xl
    p-7
    mb-10
    border
    border-emerald-100
    bg-white/80
    backdrop-blur-xl
    shadow-[0_8px_30px_rgb(0,0,0,0.08)]
    transition-all
    duration-300
  "
      >
        <h2 className="text-sm font-semibold uppercase tracking-wider text-emerald-600 mb-3">
          {title}
        </h2>

        <p className="text-4xl md:text-5xl font-black bg-gradient-to-r from-emerald-700 via-green-500 to-emerald-400 bg-clip-text text-transparent">
          ₹{currentEarning.toLocaleString()}
        </p>
      </motion.div>

      <div className="mb-10">
 <div className="mb-6">

  <h2 className="text-3xl font-bold">
    Quick Actions
  </h2>

  <p className="text-gray-500 mt-1">
    Manage your marketplace from one place.
  </p>

</div>

  <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">

    <Link
  href="/admin/manage-shop"
  className="group rounded-3xl p-7
  bg-gradient-to-br
  from-green-500
  via-emerald-500
  to-lime-400
  text-white
  shadow-xl
  hover:-translate-y-2
  hover:scale-[1.03]
  transition-all duration-300"
>
      <Store className="w-12 h-12 mb-5" />

<h3 className="text-2xl font-bold">
  Manage Shops
</h3>

<p className="mt-2 opacity-90">
  Approve, reject and monitor stores.
</p>

<div className="mt-6 font-semibold group-hover:translate-x-2 transition-transform duration-300">
  Open →
</div>
    </Link>

    <Link
  href="/admin/view-product"
  className="
    group
    rounded-3xl
    p-7
    bg-gradient-to-br
    from-blue-500
    via-cyan-500
    to-sky-400
    text-white
    shadow-xl
    hover:-translate-y-2
    hover:scale-[1.03]
    transition-all
    duration-300"
>

  <Package className="w-12 h-12 mb-5" />

  <h3 className="text-2xl font-bold">
    Products
  </h3>

  <p className="mt-2 opacity-90">
    Manage every grocery item.
  </p>

  <div className="mt-6 font-semibold group-hover:translate-x-2 transition-transform duration-300">
  Open →
</div>

</Link>

    <Link
  href="/admin/manage-orders"
  className="
    group
    rounded-3xl
    p-7
    bg-gradient-to-br
    from-orange-500
    via-red-500
    to-pink-500
    text-white
    shadow-xl
    hover:-translate-y-2
    hover:scale-[1.03]
    transition-all
    duration-300"
>

  <ShoppingCart className="w-12 h-12 mb-5" />

  <h3 className="text-2xl font-bold">
    Orders
  </h3>

  <p className="mt-2 opacity-90">
    Track every customer order.
  </p>

  <div className="mt-6 font-semibold group-hover:translate-x-2 transition-transform duration-300">
  Open →
</div>

</Link>

   <Link
  href="/admin/delivery-boys"
  className="
    group
    rounded-3xl
    p-7
    bg-gradient-to-br
    from-violet-500
    via-purple-500
    to-fuchsia-500
    text-white
    shadow-xl
    hover:-translate-y-2
    hover:scale-[1.03]
    transition-all
    duration-300"
>

  <Truck className="w-12 h-12 mb-5" />

  <h3 className="text-2xl font-bold">
    Delivery Boys
  </h3>

  <p className="mt-2 opacity-90">
    Manage delivery partners.
  </p>

  <div className="mt-6 font-semibold group-hover:translate-x-2 transition-transform duration-300">
  Open →
</div>

</Link>

  </div>
</div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10 ">
        {stats.map((s, i) => {
          const icons = [
            <Package key="p" className="text-green-700 w-6 h-6" />,
            <Users key="u" className="text-green-700 w-6 h-6" />,
            <Truck key="t" className="text-green-700 w-6 h-6" />,
            <IndianRupee key="r" className="text-green-700 w-6 h-6" />,
          ];
          return (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="bg-white border border-gray-100 shadow-md rounded-2xl p-5 flex items-center gap-4 hover:shadow-lg transition-all"
            >
              <div className="bg-green-100 p-3 rounded-xl">{icons[i]}</div>
              <div>
                <p className="text-gray-600 text-sm">{s.title}</p>
                <p className="text-2xl font-bold text-gray-800">{s.value}</p>
              </div>
            </motion.div>
          );
        })}
      </div>

      <div className="bg-white border border-gray-100 rounded-2xl shadow-md p-5 mb-10">
        <h2 className="text-lg font-semibold text-gray-700 mb-4">
          📈 Orders Overview ( Last 7 Days )
        </h2>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={chartData}>
            <CartesianGrid stroke="#ccc" strokeDasharray="5 5" />
            <XAxis dataKey="day" />
            <Tooltip />
            <Bar dataKey="orders" fill="#16A34A" radius={[6, 6, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
      <div className="bg-white rounded-3xl border border-gray-100 shadow-lg p-8 mb-10">
  <div className="flex items-center justify-between mb-8">

  <div>

    <h2 className="text-3xl font-bold">
      Recent Shop Requests
    </h2>

    <p className="text-gray-500 mt-1">
      Latest stores waiting for approval.
    </p>

  </div>

  <div className="px-4 py-2 rounded-xl bg-yellow-100 text-yellow-700 font-semibold">
    {pendingShops} Pending
  </div>

</div>

  <div className="grid md:grid-cols-2 gap-5">

  {recentShops.map((shop: any) => (

    <div
      key={shop._id}
      className="rounded-2xl border border-gray-200 bg-white p-5 hover:shadow-xl transition duration-300"
    >

      <div className="flex justify-between items-start">

        <div>

          <h3 className="text-xl font-bold">
            {shop.shopName}
          </h3>

          <p className="text-gray-500 mt-1">
            Owner: {shop.ownerName}
          </p>

        </div>

        <span
          className={`px-3 py-1 rounded-full text-xs font-bold ${
            shop.status === "approved"
              ? "bg-green-100 text-green-700"
              : "bg-yellow-100 text-yellow-700"
          }`}
        >
          {shop.status.toUpperCase()}
        </span>

      </div>

      <div className="mt-6 flex justify-end">

        <Link
          href="/admin/manage-shop"
          className="bg-green-600 hover:bg-green-700 text-white px-5 py-2 rounded-xl transition"
        >
          View Shop
        </Link>

      </div>

    </div>

  ))}

</div>

{recentShops.length === 0 && (

  <div className="text-center py-16">

    <h3 className="text-2xl font-bold text-gray-700">
      No Shop Requests
    </h3>

    <p className="text-gray-500 mt-2">
      There are currently no registered shops.
    </p>

  </div>

)}
</div>

<div className="bg-white rounded-3xl border border-gray-100 shadow-lg p-8 mb-10">

  <div className="flex justify-between items-center mb-8">

    <div>

      <h2 className="text-3xl font-bold">
        Recent Orders
      </h2>

      <p className="text-gray-500 mt-1">
        Latest customer orders.
      </p>

    </div>

    <Link
      href="/admin/manage-orders"
      className="text-green-600 font-semibold hover:underline"
    >
      View All →
    </Link>

  </div>

  <div className="space-y-5">

    {recentOrders.map((order: any) => (

      <div
        key={order._id}
        className="flex items-center justify-between border rounded-2xl p-5 hover:shadow-lg transition"
      >

        <div>

          <h3 className="font-bold text-lg">
            {order.user?.name || "Unknown User"}
          </h3>

          <p className="text-gray-500">
            ₹{order.totalAmount}
          </p>

        </div>

        <div className="text-right">

          <span
            className={`px-3 py-1 rounded-full text-sm font-semibold ${
              order.status === "pending"
                ? "bg-yellow-100 text-yellow-700"
                : order.status === "out of delivery"
                ? "bg-blue-100 text-blue-700"
                : "bg-green-100 text-green-700"
            }`}
          >
            {order.status}
          </span>

          <p className="text-sm text-gray-500 mt-2">
            {order.items.length} Items
          </p>

        </div>

      </div>

    ))}

  </div>

  {recentOrders.length === 0 && (

    <div className="text-center py-16">

      <h3 className="text-2xl font-bold text-gray-700">
        No Orders Yet
      </h3>

      <p className="text-gray-500 mt-2">
        Customer orders will appear here.
      </p>

    </div>

  )}

</div>
    </div>
  );
}

export default AdminDashboardClient;
