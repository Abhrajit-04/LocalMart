'use client'
import { Baby, Box, ChevronLeft, Coffee, Cookie, Flame, Grape, Heart, Home, Milk, Wheat } from 'lucide-react'
import React, { useEffect, useRef, useState } from 'react'
import { motion } from "motion/react"

function CategorySlider() {
  const scrollRef = useRef<HTMLDivElement>(null)
  const [showLeft, setShowLeft] = useState(false)
  const [showRight, setShowRight] = useState(false)
  const [isHovering, setIsHovering] = useState(false)

  const scroll = (direction: "left" | "right") => {
    if (!scrollRef.current) return
    const scrollAmount = direction === "left" ? -300 : 300
    scrollRef.current.scrollBy({ left: scrollAmount, behavior: "smooth" })
  }

  const checkScroll = () => {
    if (!scrollRef.current) return
    const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current
    setShowLeft(scrollLeft > 0)
    setShowRight(scrollLeft + clientWidth < scrollWidth - 5)
  }

  // Auto slide
  useEffect(() => {
    const interval = setInterval(() => {
      if (!scrollRef.current || isHovering) return

      const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current

      if (scrollLeft + clientWidth >= scrollWidth - 5) {
        scrollRef.current.scrollTo({ left: 0, behavior: "smooth" })
      } else {
        scrollRef.current.scrollBy({ left: 300, behavior: "smooth" })
      }
    }, 2000)

    return () => clearInterval(interval)
  }, [isHovering])

  // Scroll listener
  useEffect(() => {
    const current = scrollRef.current
    if (!current) return

    current.addEventListener("scroll", checkScroll)
    checkScroll()

    return () => current.removeEventListener("scroll", checkScroll)
  }, [])

  const categories = [
    { id: "fruits-vegetables", name: "Fruits & Vegetables", slug: "fruits-vegetables", icon: Grape, color: "bg-green-100 text-green-600" },
    { id: "dairy-eggs", name: "Dairy & Eggs", slug: "dairy-eggs", icon: Milk, color: "bg-blue-100 text-blue-600" },
    { id: "rice-atta-grains", name: "Rice, Atta & Grains", slug: "rice-atta-grains", icon: Wheat, color: "bg-yellow-100 text-yellow-600" },
    { id: "snacks-biscuits", name: "Snacks & Biscuits", slug: "snacks-biscuits", icon: Cookie, color: "bg-orange-100 text-orange-600" },
    { id: "spices-masalas", name: "Spices & Masalas", slug: "spices-masalas", icon: Flame, color: "bg-red-100 text-red-600" },
    { id: "beverages-drinks", name: "Beverages & Drinks", slug: "beverages-drinks", icon: Coffee, color: "bg-amber-100 text-amber-600" },
    { id: "personal-care", name: "Personal Care", slug: "personal-care", icon: Heart, color: "bg-pink-100 text-pink-600" },
    { id: "household-essentials", name: "Household Essentials", slug: "household-essentials", icon: Home, color: "bg-gray-100 text-gray-600" },
    { id: "instant-food", name: "Instant & Packaged Food", slug: "instant-food", icon: Box, color: "bg-purple-100 text-purple-600" },
    { id: "baby-pet-care", name: "Baby & Pet Care", slug: "baby-pet-care", icon: Baby, color: "bg-teal-100 text-teal-600" }
  ]

  return (
    <motion.div
      className='w-[90%] md:w-[80%] mx-auto mt-16 relative'
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      viewport={{ once: false, amount: 0.5 }}
    >
      <h2 className='text-2xl md:text-3xl font-bold text-green-700 mb-6 text-center'>
        🛒 Shop by Category
      </h2>

      {/* Slider Section */}
      <div
        className="relative"
        onMouseEnter={() => setIsHovering(true)}
        onMouseLeave={() => setIsHovering(false)}
      >

        {/* Left Button */}
        {showLeft && (
          <button
            onClick={() => scroll("left")}
            className="hidden md:flex absolute left-[-20px] top-1/2 -translate-y-1/2 z-10 
            group bg-white/90 backdrop-blur-md border border-gray-200 shadow-lg 
            rounded-full w-11 h-11 items-center justify-center 
            transition-all duration-300 hover:scale-110 hover:bg-green-200"
          >
            <ChevronLeft className="w-5 h-5 text-gray-700 group-hover:text-green-600 transition-colors" />
          </button>
        )}

        {/* Scroll Container */}
        <div
          ref={scrollRef}
          className='flex gap-6 overflow-x-auto px-6 py-8 pb-4 scrollbar-hide scroll-smooth'
        >
          {categories.map((category) => {
            const Icon = category.icon
            return (
              <motion.div
                key={category.id}
                whileHover={{ y: -6 }}
                className={`min-w-[150px] md:min-w-[180px] flex flex-col items-center justify-center rounded-xl 
                shadow-[0_8px_20px_rgba(0,0,0,0.08)] hover:shadow-[0_12px_30px_rgba(0,0,0,0.15)] 
                ${category.color} cursor-pointer transition-all duration-300`}
              >
                <div className='flex flex-col items-center justify-center p-5'>
                  <Icon className='w-10 h-10 text-green-700 mb-3' />
                  <p className='text-center text-sm md:text-base font-semibold text-gray-700'>
                    {category.name}
                  </p>
                </div>
              </motion.div>
            )
          })}
        </div>

        {/* Right Button */}
        {showRight && (
          <button
            onClick={() => scroll("right")}
            className="hidden md:flex absolute right-[-20px] top-1/2 -translate-y-1/2 z-10 
            group bg-white/90 backdrop-blur-md border border-gray-200 shadow-lg 
            rounded-full w-11 h-11 items-center justify-center 
            transition-all duration-300 hover:scale-110 hover:bg-green-200"
          >
            <ChevronLeft className="w-5 h-5 rotate-180 text-gray-700 group-hover:text-green-600 transition-colors" />
          </button>
        )}

      </div>
    </motion.div>
  )
}

export default CategorySlider