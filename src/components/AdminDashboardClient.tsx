'use client'
import React, { useState } from 'react'
import{ motion} from "motion/react"

type propType={
    earning:{
        today:number,
        sevenDays:number,
        total:number
    }
}

function AdminDashboardClient({earning}:propType) {

    const [filter,setFilter]=useState<"today" | "sevenDays" | "total">()
    const currentEarning=filter==="today"?earning.today
    :filter==="sevenDays"?earning.sevenDays
    :earning.total

    const title=filter==="today"?"Today's Earning"
    :filter==="sevenDays"?"Last 7 Days Earning"
    :"Total Earning"
  return (
    <div className='pt-28 w-[92%] lg:w-[85%] mx-auto'>
    <div className='flex flex-col md:flex-row md:items-center md:justify-between gap-6 mb-10 text-center md:text-left'>
        
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

        <select className='w-full md:w-auto px-5 py-3 rounded-2xl bg-white/80 backdrop-blur-md border border-green-100 shadow-lg text-gray-700 font-medium focus:ring-2 focus:ring-green-500 focus:outline-none transition-all duration-300'
        onChange={(e)=>setFilter(e.target.value as any)}
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
    ease: "easeOut"
  }}
  whileHover={{
    y: -4,
    scale: 1.01
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

</div>
  )
}

export default AdminDashboardClient