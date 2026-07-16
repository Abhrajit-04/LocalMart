"use client";

import Link from "next/link";
import axios from "axios";
import { useEffect, useState } from "react";
import { motion } from "motion/react";
import {
  PlusCircle,
  Package2,
  ShoppingCart,
  Settings,
  Store,
  ArrowRight,
} from "lucide-react";

export default function ShopOwnerDashboard() {

  const [stats, setStats] = useState({
  products: 0,
  totalOrders: 0,
  revenue: 0,
  rating: 0,
});

useEffect(() => {
  const getDashboard = async () => {
    try {
      const res = await axios.get("/api/shop/dashboard");
      setStats(res.data);
    } catch (err) {
      console.log(err);
    }
  };

  getDashboard();
}, []);

  const cards = [
    {
      title: "Add Product",
      icon: PlusCircle,
      href: "/shop/add-product",
      color: "from-green-500 to-emerald-600",
    },
    {
      title: "My Products",
      icon: Package2,
      href: "/shop/view-products",
      color: "from-blue-500 to-cyan-600",
    },
    {
      title: "Orders",
      icon: ShoppingCart,
      href: "/shop/orders",
      color: "from-orange-500 to-red-500",
    },
    {
      title: "Shop Settings",
      icon: Settings,
      href: "/shop/settings",
      color: "from-violet-500 to-purple-600",
    },
  ];

  return (
    <div
      className="relative overflow-hidden min-h-screen bg-gradient-to-br
from-[#f5fff7]
via-[#e9fff3]
to-[#fffef4] pt-32 pb-12 px-6 md:px-10"
    >
      {/* Background Blobs */}

      <div className="pointer-events-none absolute top-32 right-20 w-72 h-72 rounded-full bg-green-300/20 blur-3xl -z-10" />

      <div className="pointer-events-none absolute bottom-20 left-10 w-80 h-80 rounded-full bg-emerald-300/20 blur-3xl -z-10" />

      <div className="pointer-events-none absolute top-1/2 left-1/2 w-96 h-96 rounded-full bg-lime-200/20 blur-3xl -translate-x-1/2 -translate-y-1/2 -z-10" />

      {/* Header */}

      <motion.div
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="flex flex-col md:flex-row md:items-center md:justify-between mb-12"
      >
        <div className="flex items-center gap-5">
          <div
            className="w-20 h-20 rounded-3xl
      bg-gradient-to-br
      from-green-600
      via-emerald-500
      to-lime-400
      shadow-2xl
      flex items-center justify-center"
          >
            <Store className="w-10 h-10 text-white" />
          </div>

          <div>
            <h1
              className="
        text-4xl
        md:text-5xl
        font-black
        bg-gradient-to-r
        from-green-700
        via-emerald-500
        to-lime-500
        bg-clip-text
        text-transparent"
            >
              Shop Owner Dashboard
            </h1>

            <p className="text-gray-600 mt-2">
              Welcome back 👋 Manage your business in one place.
            </p>

            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.3 }}
              className="inline-flex items-center gap-2 mt-5 px-4 py-2 rounded-full bg-white/70 backdrop-blur-xl border border-white/60 shadow-lg"
            >
              <span className="w-2.5 h-2.5 rounded-full bg-green-500 animate-pulse" />

              <span className="text-sm font-semibold text-green-700">
                Shop Active
              </span>
            </motion.div>
          </div>
        </div>
      </motion.div>
      {/* Stats */}

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
        <motion.div
          initial={{ opacity: 0, y: 25 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          whileHover={{
            y: -8,
            scale: 1.03,
          }}
          className="
  bg-white/100
  backdrop-blur-xl
  border
  border-white/40
  rounded-3xl
  shadow-[0_10px_30px_rgba(16,185,129,0.15)]
  p-6"
        >
          <p className="text-gray-500">Products</p>
          <h2 className="text-4xl font-bold mt-2">{stats.products}</h2>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 25 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          whileHover={{
            y: -8,
            scale: 1.03,
          }}
          className="
  bg-white/100
  backdrop-blur-xl
  border
  border-white/40
  rounded-3xl
  shadow-[0_10px_30px_rgba(16,185,129,0.15)]
  p-6"
        >
          <p className="text-gray-500">Orders</p>
          <h2 className="text-4xl font-bold mt-2">{stats.totalOrders}</h2>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 25 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          whileHover={{
            y: -8,
            scale: 1.03,
          }}
          className="
  bg-white/100
  backdrop-blur-xl
  border
  border-white/40
  rounded-3xl
  shadow-[0_10px_30px_rgba(16,185,129,0.15)]
  p-6"
        >
          <p className="text-gray-500">Revenue</p>
          <h2 className="text-4xl font-bold mt-2">₹{stats.revenue}</h2>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 25 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          whileHover={{
            y: -8,
            scale: 1.03,
          }}
          className="
  bg-white/100
  backdrop-blur-xl
  border
  border-white/40
  rounded-3xl
  shadow-[0_10px_30px_rgba(16,185,129,0.15)]
  p-6"
        >
          <p className="text-gray-500">Rating</p>
          <h2 className="text-4xl font-bold mt-2">
{stats.rating > 0 ? `⭐ ${stats.rating.toFixed(1)}` : "New Shop"}
</h2>
        </motion.div>
      </div>

      {/* Dashboard Cards */}

      <motion.div
        initial="hidden"
        animate="visible"
        variants={{
          hidden: {},
          visible: {
            transition: {
              staggerChildren: 0.12,
            },
          },
        }}
        className="grid md:grid-cols-2 xl:grid-cols-4 gap-8"
      >
        {cards.map((card) => {
          const Icon = card.icon;

          return (
            <Link key={card.title} href={card.href} className="group">
              <motion.div
                variants={{
                  hidden: {
                    opacity: 0,
                    y: 30,
                  },
                  visible: {
                    opacity: 1,
                    y: 0,
                  },
                }}
                whileHover={{
                  y: -12,
                  scale: 1.04,
                }}
                whileTap={{
                  scale: 0.98,
                }}
                className="
  group
  relative
  overflow-hidden
  rounded-3xl
  bg-white/70
  backdrop-blur-xl
  border
  border-white/50
  shadow-[0_10px_35px_rgba(16,185,129,0.15)]
  hover:shadow-[0_20px_60px_rgba(16,185,129,0.25)]
  transition-all
  duration-500
  p-8"
              >
                <div
                  className={`absolute inset-x-0 top-0 h-2 bg-gradient-to-r ${card.color}`}
                />

                <div
                  className="
absolute
inset-0
opacity-0
group-hover:opacity-100
transition
duration-500
bg-gradient-to-br
from-green-100/20
to-transparent"
                />

                <motion.div
                  whileHover={{
                    rotate: 12,
                    scale: 1.2,
                  }}
                  whileTap={{
                    rotate: -8,
                  }}
                  transition={{
                    type: "spring",
                    stiffness: 320,
                    damping: 12,
                  }}
                  className={`w-16 h-16 rounded-2xl bg-gradient-to-r ${card.color} flex items-center justify-center mb-6 shadow-lg`}
                >
                  <Icon className="text-white w-8 h-8" />
                </motion.div>

                <h2 className="text-2xl font-bold transition-all duration-300 group-hover:text-green-700">
                  {card.title}
                </h2>

                <p className="text-gray-500 mt-2 group-hover:text-gray-700 transition-all">
                  Click to manage
                </p>
                <motion.div
                  animate={{
                    x: [0, 5, 0],
                  }}
                  transition={{
                    repeat: Infinity,
                    duration: 1.5,
                    ease: "easeInOut",
                  }}
                  className="mt-5 text-green-600"
                >
                  <ArrowRight className="w-5 h-5" />
                </motion.div>
              </motion.div>
            </Link>
          );
        })}
      </motion.div>
    </div>
  );
}
