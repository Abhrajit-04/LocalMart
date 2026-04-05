'use client'
import mongoose from 'mongoose'
import React from 'react'
import {motion} from "motion/react"
import Image from 'next/image'
import { PlusCircle, ShoppingCart } from 'lucide-react'

interface IGrocery {
    _id?:mongoose.Types.ObjectId,
    name:string,
    category:string,
    price:string,
    unit:string,
    image:string,
    createdAt?:Date,
    updatedAt?:Date
}
function ProductItemCard({item}: {item: IGrocery}) {
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
    <motion.button
  whileTap={{ scale: 0.95 }}
  whileHover={{ scale: 1.03 }}
  className='mt-4 flex items-center justify-center gap-2 
  bg-gradient-to-r from-green-600 to-emerald-500 
  hover:from-green-700 hover:to-emerald-600
  text-white rounded-full py-2.5 text-sm font-semibold 
  shadow-[0_4px_14px_rgba(16,185,129,0.35)]
  hover:shadow-[0_6px_20px_rgba(16,185,129,0.55)]
  transition-all duration-300'
>
  <ShoppingCart className='w-4 h-4'/>
  Add to Cart
</motion.button>

</div>
</motion.div>
  )
}

export default ProductItemCard