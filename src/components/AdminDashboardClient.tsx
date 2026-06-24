'use client'
import React, { useState } from 'react'
import{ motion} from "motion/react"
import { IndianRupee, Package, Truck, User, Users } from 'lucide-react'
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis } from 'recharts'

type propType={
    earning:{
        today:number,
        sevenDays:number,
        total:number
    },
     stats: {
    title: string;
    value: number;
}[],
chartData: {
    day: string;
    orders: number;
}[]
}

function AdminDashboardClient({earning,stats,chartData}:propType) {

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

<div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10 '>
{stats.map((s,i)=>{
  const icons=[
    <Package key="p" className='text-green-700 w-6 h-6'/>,
    <Users key="u" className='text-green-700 w-6 h-6'/>,
    <Truck key="t" className='text-green-700 w-6 h-6'/>,
    <IndianRupee key="r" className='text-green-700 w-6 h-6'/>
  ]
  return <motion.div
  key={i}
  initial={{opacity:0,y:20}}
  animate={{opacity:1,y:0}}
  transition={{delay:i * 0.1}}
  className='bg-white border border-gray-100 shadow-md rounded-2xl p-5 flex items-center gap-4 hover:shadow-lg transition-all'>
    <div className='bg-green-100 p-3 rounded-xl'>
        {icons[i]}
    </div>
    <div>
      <p className='text-gray-600 text-sm'>{s.title}</p>
      <p className='text-2xl font-bold text-gray-800'>{s.value}</p>
    </div>
  </motion.div>
})}
</div>

<div className='bg-white border border-gray-100 rounded-2xl shadow-md p-5 mb-10'>
  <h2 className='text-lg font-semibold text-gray-700 mb-4'>📈 Orders Overview ( Last 7 Days )</h2>
  <ResponsiveContainer width="100%" height={300}>
      <BarChart data={chartData}>
        <CartesianGrid stroke="#ccc" strokeDasharray="5 5"/>
        <XAxis dataKey="day"/>
        <Tooltip/>
        <Bar dataKey="orders" fill='#16A34A' radius={[ 6, 6, 0, 0]}/>
      </BarChart>
  </ResponsiveContainer>
</div>

</div>
  )
}

export default AdminDashboardClient