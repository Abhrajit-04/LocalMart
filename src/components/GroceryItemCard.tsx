'use client'
import mongoose from 'mongoose'
import React from 'react'
import {motion} from "motion/react"
import Image from 'next/image'
import { Minus, Plus, PlusCircle, ShoppingCart } from 'lucide-react'
import { useDispatch, useSelector } from 'react-redux'
import { AppDispatch, RootState } from '@/redux/store'
import { addToCart, decreaseQuantity, increaseQuantity } from '@/redux/cartSlice'

interface IGrocery {
    _id:mongoose.Types.ObjectId,
    name:string,
    category:string,
    price:string,
    unit:string,
    image:string,
    createdAt?:Date,
    updatedAt?:Date
}
function ProductItemCard({item}: {item: IGrocery}) {
  const dispatch=useDispatch<AppDispatch>()
  const {carData}=useSelector((state: RootState)=>state.cart)
  const cartItem=carData.find(i=>i._id==item._id)
  return (
    <motion.div
  initial={{ opacity: 0, y: 50, scale: 0.9 }}
  whileInView={{ opacity: 1, y: 0, scale: 1 }}
  transition={{ duration: 0.5 }}
  viewport={{ once: false, amount: 0.3 }}
  className='group bg-white/70 backdrop-blur-md rounded-2xl 
  shadow-[0_8px_25px_rgba(0,0,0,0.08)]
  hover:shadow-[0_18px_40px_rgba(0,0,0,0.15)]
  transition-all duration-300 overflow-hidden 
  border border-white/40 flex flex-col hover:-translate-y-1'
>
  <div className='relative w-full aspect-[4/3] bg-gray-50 overflow-hidden'>
    
    <Image
      src={item.image}
      fill
      alt={item.name}
      sizes='(max-width: 768px) 100vw, 25vw'
      className='object-contain p-4 transition-transform duration-500 group-hover:scale-110'
    />

    {/* Gradient Hover Overlay */}
    <div className='absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-all duration-300' />

  </div>

<div className='p-4 flex flex-col flex-1 bg-white/60 backdrop-blur-md'>
  
  <p className='text-[11px] tracking-wide text-green-700/70 font-semibold mb-1 uppercase'>
    {item.category}
  </p>

  <h3 className='text-sm md:text-base font-semibold text-gray-800 leading-tight line-clamp-2'>
    {item.name}
  </h3>

  <div className='flex items-center justify-between mt-3'>
    
    <span className='text-[11px] font-semibold text-green-700 bg-green-100 px-2.5 py-1 rounded-full'>
      {item.unit}
    </span>

    <span className='text-green-700 font-bold text-lg'>
      ₹{item.price}
    </span>

  </div>
    {!cartItem ? (
  <motion.button
    whileTap={{ scale: 0.96 }}
    whileHover={{ scale: 1.05 }}
    onClick={() => dispatch(addToCart({ ...item, quantity: 1 }))}
    className="mt-4 w-full flex items-center justify-center gap-2
    text-white font-semibold text-sm
    rounded-full py-2.5
    bg-gradient-to-r from-green-500 to-emerald-500
    shadow-[0_6px_20px_rgba(16,185,129,0.45)]
    hover:shadow-[0_8px_25px_rgba(16,185,129,0.6)]
    transition-all duration-300"
  >
    <ShoppingCart className="w-4 h-4" />
    Add to Cart
  </motion.button>
) : (
  <motion.div
    initial={{ opacity: 0, y: 10 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.25 }}
    className="mt-4 flex items-center justify-between
    bg-green-50 border border-green-300
    rounded-full px-2 py-1.5 w-[130px]
    shadow-[0_4px_18px_rgba(16,185,129,0.25)]"
  >
    {/* Minus */}
    <button
      onClick={() => dispatch(decreaseQuantity(item._id))}
      className="w-8 h-8 flex items-center justify-center
      rounded-full bg-gradient-to-r from-green-500 to-emerald-500
      text-white shadow-md
      hover:scale-105 active:scale-90 transition-all duration-200"
    >
      <Minus size={16} />
    </button>

    {/* Quantity */}
    <span className="text-sm font-bold text-green-700 w-6 text-center">
      {cartItem.quantity}
    </span>

    {/* Plus */}
    <button
      onClick={() => dispatch(increaseQuantity(item._id))}
      className="w-8 h-8 flex items-center justify-center
      rounded-full bg-gradient-to-r from-green-500 to-emerald-500
      text-white shadow-md
      hover:scale-105 active:scale-90 transition-all duration-200"
    >
      <Plus size={16} />
    </button>
  </motion.div>
)}
   

</div>
</motion.div>
  )
}

export default ProductItemCard