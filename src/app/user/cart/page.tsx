"use client";
import { ArrowLeft, Minus, Plus, ShoppingBasket, Trash2 } from "lucide-react";
import Link from "next/link";
import React from "react";
import { AnimatePresence, motion } from "motion/react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/redux/store";
import Image from "next/image";
import {
  decreaseQuantity,
  increaseQuantity,
  removefromCart,
} from "@/redux/cartSlice";
import { useRouter } from "next/navigation";

function Cartpage() {
  const { carData, subTotal, finalTotal, deliveryFee } = useSelector(
    (state: RootState) => state.cart,
  );
  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();

  return (
    <div className="w-[95%] sm:w-[90%] md:w-[80%] mx-auto mt-8 mb-24 relative">
      <Link
        href={"/"}
        className="absolute -top-2 left-0 flex items-center gap-2 text-green-700 hover:text-green-800 font-medium transition-all"
      >
        <ArrowLeft size={20} />
        <span className="hidden sm:inline">Back to home</span>
      </Link>

      <motion.h2
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="text-2xl sm:text-3xl md:text-4xl font-bold text-green-700 text-center mb-10"
      >
        🛍 Your Shopping Cart
      </motion.h2>

      {carData.length === 0 ? (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="text-center py-20 bg-white/40 backdrop-blur-lg rounded-2xl shadow-md"
        >
          <ShoppingBasket className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-700 text-lg mb-6">
            Your Cart is empty. Add some products to shopping!
          </p>
          <Link
            href={"/"}
            className="bg-green-600 text-white px-6 py-3 rounded-full hover:bg-green-700 transition-all inline-block font-medium"
          >
            Continue Shopping
          </Link>
        </motion.div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2">
            <AnimatePresence>
              {carData.map((item, index) => (
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  whileHover={{ scale: 1.02 }}
                  key={index}
                  className="flex flex-col sm:flex-row sm:items-center gap-4
                  bg-white/40 backdrop-blur-lg
                  rounded-2xl shadow-[0_8px_30px_rgba(0,0,0,0.08)]
                  p-4 sm:p-5
                  border border-white/40
                  hover:shadow-[0_12px_40px_rgba(16,185,129,0.25)]
                  transition-all duration-300 mb-4"
                >
                  {/* Image */}
                  <div
                    className="relative w-20 h-20 sm:w-24 sm:h-24 md:w-28 md:h-28 flex-shrink-0
                  rounded-xl overflow-hidden bg-white/40 backdrop-blur-md"
                  >
                    <Image
                      src={item.image}
                      alt={item.name}
                      fill
                      className="object-contain p-3 transition-transform duration-500 hover:scale-110"
                    />
                  </div>

                  {/* Product Info */}
                  <div className="flex-1 min-w-0 text-center sm:text-left">
                    <h3 className="text-sm sm:text-base md:text-lg font-semibold text-gray-800 break-words">
                      {item.name}
                    </h3>
                    <p className="text-xs sm:text-sm text-gray-600">
                      {item.unit}
                    </p>
                    <p className="text-green-700 font-bold mt-1 text-sm sm:text-base">
                      ₹{Number(item.price) * item.quantity}
                    </p>
                  </div>

                  {/* Quantity + Delete */}
                  <div className="flex items-center justify-between sm:justify-end gap-3 w-full sm:w-auto">
                    {/* Liquid Glass Quantity */}
                    <div
                      className="flex items-center gap-2
                    bg-white/40 backdrop-blur-md
                    px-3 py-1.5 rounded-full
                    border border-white/40
                    shadow-inner"
                    >
                      <button
                        className="p-1.5 rounded-full
                        bg-white/50 backdrop-blur-md
                        hover:bg-green-200/60
                        transition-all duration-200"
                        onClick={() => dispatch(decreaseQuantity(item._id))}
                      >
                        <Minus size={14} className="text-green-800" />
                      </button>

                      <span className="w-5 text-center font-semibold text-gray-800">
                        {item.quantity}
                      </span>

                      <button
                        className="p-1.5 rounded-full
                        bg-white/50 backdrop-blur-md
                        hover:bg-green-200/60
                        transition-all duration-200"
                        onClick={() => dispatch(increaseQuantity(item._id))}
                      >
                        <Plus size={14} className="text-green-800" />
                      </button>
                    </div>

                    {/* Delete */}
                    <button
                      className="text-red-500 hover:text-red-700 transition-all"
                      onClick={() => dispatch(removefromCart(item._id))}
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3 }}
            className="bg-gray-900/30 sm:bg-gray-900/20 backdrop-blur-md sm:backdrop-blur-lg rounded-2xl shadow-[0_8px_30px_rgba(0,0,0,0.25)] p-6 h-fit sticky top-24 border border-white/10 flex flex-col transition-all duration-300 hover:shadow-[0_12px_40px_rgba(0,0,0,0.35)]"
          >
            <h2 className="text-lg sm:text-xl font-bold text-gray-800 mb-4">
              Order Summary
            </h2>
            <div className="space-y-3 text-gray-800 text-sm sm:text-base">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span className="text-green-700 font-semibold">
                  ₹{subTotal}
                </span>
              </div>
              <div className="flex justify-between">
                <span>Delivery fee</span>
                <span className="text-green-700 font-semibold">
                  ₹{deliveryFee}
                </span>
              </div>
              <hr className="my-3" />
              <div className="flex justify-between font-bold text-lg sm:text-xl">
                <span>Final Total</span>
                <span className="text-green-700 font-semibold">
                  ₹{finalTotal}
                </span>
              </div>
            </div>
            <motion.button
              whileTap={{ scale: 0.96 }}
              whileHover={{ scale: 1.02 }}
              className="w-full mt-6 py-3 rounded-full 
                text-white font-semibold text-sm sm:text-base
                bg-green-500/90 backdrop-blur-md
                border border-white/20
                shadow-[0_6px_20px_rgba(16,185,129,0.35)]
                hover:bg-green-500 hover:shadow-[0_8px_25px_rgba(16,185,129,0.5)]
                active:scale-95 active:shadow-[0_4px_12px_rgba(16,185,129,0.3)]
                transition-all duration-300" onClick={()=>router.push("/user/checkout")}
                            >
              Proceed to Checkout
            </motion.button>
          </motion.div>
        </div>
      )}
    </div>
  );
}

export default Cartpage;
