'use client'
import mongoose from 'mongoose'
import React, { useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import { LogOut, Package, Search, ShoppingBag, ShoppingCart, User, X } from 'lucide-react'
import Image from 'next/image'
import { AnimatePresence,motion } from 'motion/react'
import { signOut } from 'next-auth/react'
interface IUser {
  _id?: mongoose.Types.ObjectId
  name: string
  email: string
  password?: string
  mobile?: string
  role: "user" | "deliveryboy" | "admin"
  image?: string
}
function Nav({ user }: { user: IUser }) {
    const [open,setopen]=useState(false)
    const profileDropDown=useRef<HTMLDivElement>(null)
    const [searchBarOpen,setSearchBarOpen]=useState(false)
    useEffect(()=>{
        const handelClickOutside=(e:MouseEvent)=>{
            if(profileDropDown.current && !profileDropDown.current.contains(e.target as Node)){
                setopen(false)
            }
        }
        document.addEventListener("mousedown",handelClickOutside)
        return ()=>document.removeEventListener("mousedown",handelClickOutside)
    },[])
  return (
    <div className="w-[95%] fixed top-4 left-1/2 -translate-x-1/2 
    bg-white/90 backdrop-blur-md 
    border border-gray-200 
    rounded-2xl shadow-lg 
    flex justify-between items-center 
    h-16 px-6 md:px-10 z-50">

     <Link href="/" className="flex items-center gap-2 group">
  <ShoppingCart className="w-7 h-7 text-green-600 group-hover:scale-110 transition" />
  <span className="font-extrabold text-2xl tracking-wider 
  bg-gradient-to-r from-green-600 to-emerald-500 
  bg-clip-text text-transparent hover:scale-105 transition">
    LoKart
  </span>
</Link>
      <form className="hidden md:flex items-center 
bg-emerald-50 
border border-emerald-200 
rounded-full px-5 py-2.5 w-1/2 max-w-lg 
shadow-sm focus-within:bg-white 
focus-within:shadow-md 
focus-within:ring-2 focus-within:ring-emerald-400/40
transition-all duration-300">
    <Search className="w-5 h-5 text-gray-500 group-focus-within:text-green-600 transition-colors duration-200"/>
    <input
  type="text"
  placeholder="Search for groceries, products..."
  className="bg-transparent outline-none w-full text-gray-700 placeholder-gray-500 px-3"
/>
      </form>

<div className="flex items-center gap-3 md:gap-6 relative">

    <div className="md:hidden p-2.5 ml-2
bg-gradient-to-br from-white/80 to-emerald-50
backdrop-blur-md
border border-emerald-100
rounded-lg
shadow-[0_4px_12px_rgba(0,0,0,0.08)]
hover:shadow-[0_6px_16px_rgba(0,0,0,0.12)]
hover:scale-105
transition-all duration-200" onClick={()=>setSearchBarOpen((prev)=>!prev)}>
  <Search className="w-5 h-5 text-emerald-600" />
</div>



  <Link 
    href="/cart" 
    className="relative flex items-center justify-center text-gray-700 hover:text-green-600 transition-colors duration-200 hover:scale-110"
  >
    <ShoppingBag className="w-6 h-6" />
    <span className="absolute -top-1.5 -right-1.5 
  bg-green-600 text-white text-[10px] 
  min-w-[18px] h-[18px] px-1
  flex items-center justify-center 
  rounded-full font-semibold 
  shadow-md border-2 border-white">
        0 </span>
  </Link>
  <div className='relative' ref={profileDropDown}>
  <div className='bg-gray-200 rounded-full w-11 h-11 overflow-hidden flex items-center justify-center shadow-md hover:shadow-lg transition-shadow duration-200 hover:scale-105' onClick={()=>setopen(prev=>!prev)}>
    {user.image?<Image src={user.image} alt='user' fill className='object-cover rounded-full'/>:<User/>}
  </div>
  <AnimatePresence>
    {open && 
    <motion.div
    initial={{opacity:0,y:-10,scale:0.95}}
    animate={{opacity:1,y:0,scale:1}}
    transition={{duration:0.4}}
    exit={{opacity:0,y: -10,scale:0.95}}
        className='absolute right-0 mt-3 w-56 bg-white rounded-2xl shadow-xl border border-gray-200 p-3 z-999'
    >
        <div className='flex items-center gap-3 px-3 py-2 border-b border-gray-100'>
           <div className='w-10 h-10 relative rounded-full bg-green-100 flex items-center justify-center overflow-hidden'>
           {user.image?<Image src={user.image} alt='user' fill className='object-cover rounded-full'/>:<User/>} 
            </div> 
            <div>
                <div className='text-gray-800 font-semibold'>{user.name}</div>
                <div className='text-xs text-gray-500 capitalize'>{user.role}</div>
            </div>
        </div>
        
       <Link
  href="/orders"
  className="flex items-center gap-3 px-4 py-2.5 
  rounded-xl text-gray-700 font-medium
  hover:bg-gradient-to-r hover:from-emerald-50 hover:to-green-300
  hover:text-emerald-700
  transition-all duration-200 group"
  onClick={() => setopen(false)}
>
  <Package className="w-5 h-5 text-emerald-600 group-hover:scale-110 transition-transform duration-200" />
  My Orders
</Link>
        <button className='flex -items-center gap-2 w-full text-left px-3 py-3 hover:bg-red-200 rounded-lg text-gray-700 font-medium' onClick={()=>{
            setopen(false)
            signOut({callbackUrl:"/login"})
        }}>
        <LogOut className='w-5 h-5 text-red-600'/>
            Log Out
            
        </button>
        
        </motion.div>}
  </AnimatePresence>

  <AnimatePresence>
  {searchBarOpen && (
    <motion.div
      initial={{ opacity: 0, y: -20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -20, scale: 0.95 }}
      transition={{ duration: 0.25 }}
      className="fixed top-20 left-1/2 -translate-x-1/2 w-[92%] 
      bg-white/70 backdrop-blur-xl 
      border border-white/40 
      rounded-xl shadow-[0_8px_30px_rgba(0,0,0,0.12)] 
      z-40 flex items-center px-4 py-3"
    >
      <Search className="text-emerald-600 w-5 h-5 mr-3" />

      <form className="flex-1">
        <input
          type="text"
          placeholder="What are you looking for?"
          className="w-full bg-transparent outline-none text-gray-700 placeholder-gray-500"
        />
      </form>

      <button onClick={() => setSearchBarOpen(false)}>
        <X className="text-gray-500 w-5 h-5 hover:text-red-500 transition" />
      </button>
    </motion.div>
  )}
</AnimatePresence>
  
  </div>
</div>

    </div>
  )
}

export default Nav