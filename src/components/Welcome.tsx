'use client'
import React from 'react'
import { motion } from "motion/react"
import { ArrowBigDown, ArrowBigRight, BikeIcon, LucideShoppingBag, LucideShoppingBasket, ShoppingBasket, ShoppingBasketIcon, ShoppingCart, ShoppingCartIcon } from 'lucide-react'
type propType = {
    nextStep: (step: number) => void
}
function Welcome({nextStep}:propType) {
  return (
    <div className='flex flex-col items-center justify-center min-h-screen text-center p-6'>
        <motion.div
        initial={{opacity:0,y:-10}}
        animate={{opacity:1,y:0}}
        transition={{duration:0.6}}
        className='flex items-center gap-3'>
            <ShoppingCart className='w-10 h-10 text-green-600'/>
           <h1 className="text-4xl md:text-5xl font-extrabold bg-gradient-to-r from-emerald-600 via-green-500 to-amber-500 bg-clip-text text-transparent drop-shadow-md">
  LoKart
</h1>
        </motion.div>
        <motion.p
        initial={{opacity:0,y:10}}
        animate={{opacity:1,y:0}}
        transition={{duration:0.6,delay:0.3}}
        className="mt-4 text-lg md:text-xl text-gray-700 max-w-md"
        >
    Your neighborhood marketplace. Discover and shop directly with local businesses right around the corner.
        </motion.p>
        <motion.div
        initial={{opacity:0,scale:0.9}}
        animate={{opacity:1,scale:1}}
        transition={{duration:0.6,delay:0.6}}
        className="flex items-center justify-center gap-10 mt-10"
        >
            <LucideShoppingBasket className='w-24 h-24 md:w-32 md:h-32 text-green-600 drop-shadow-md'/>
            <BikeIcon className='w-24 h-24 md:w-32 md:h-32 text-orange-500 drop-shadow-md'/>

        </motion.div>

<motion.button
        initial={{opacity:0,y:20}}
        animate={{opacity:1,y:0}}
        transition={{duration:0.6,delay:0.9}}
            onClick={() => nextStep(2)}
        className="inline-flex items-center gap-2 mt-12 px-6 py-3 bg-green-600 text-white rounded-lg shadow-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition-colors duration-300 animate-hover"
        >
            Get Started
            <ArrowBigRight className='w-5 h-5 ml-2 animate-bounce'/>
        </motion.button>

    </div>
  )
}

export default Welcome