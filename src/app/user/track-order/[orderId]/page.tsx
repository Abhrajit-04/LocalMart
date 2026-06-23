'use client'

import LiveMap from '@/components/LiveMap';
import { getSocket } from '@/lib/socket';
import { IUser } from '@/models/user.model';
import { RootState } from '@/redux/store';
import axios from 'axios'
import { ArrowLeft, Loader, Send, Sparkle } from 'lucide-react';
import mongoose from 'mongoose';
import { useParams, useRouter } from 'next/navigation'
import {AnimatePresence, motion} from "motion/react"
import React, { useEffect, useRef, useState } from 'react'
import { useSelector } from 'react-redux';
import { IMessage } from '@/models/message.model';

interface IOrder {
  _id?: mongoose.Types.ObjectId;
  user: mongoose.Types.ObjectId;
  items: [
    {
      grocery: mongoose.Types.ObjectId;
      name: string;
      price: string;
      unit: string;
      image: string;
      quantity: number;
    },
  ];
  isPaid: boolean;
  totalAmount: number;
  paymentMethod: "cod" | "online";
  address: {
    fullName: string;
    mobile: string;
    city: string;
    state: string;
    pincode: string;
    fullAddress: string;
    latitude: number;
    longitude: number;
  };
  assignment?: mongoose.Types.ObjectId;
  assignedDeliveryBoy?: IUser;
  status: "pending" | "out of delivery" | "delivered";
  createdAt?: Date;
  updatedAt?: Date;
}
interface ILocation{
    latitude:number,
    longitude:number
}

function TrackOrder() {
  const {userData}=useSelector((state:RootState)=>state.user)
  const params = useParams()
  const orderId = params.orderId as string

  const [order,setOrder]=useState<IOrder>()
  const router=useRouter()
  const [newMessage,setNewMessage]=useState("")
  const [messages,setMessages]=useState<IMessage[]>()
  const chatBoxRef=useRef<HTMLDivElement>(null) 
  const inputRef = useRef<HTMLInputElement>(null)
   const [suggestions,setSuggestions]=useState<string[]>([])
      const [loading,setLoading]=useState(false)
  const [userLocation,setUserLocation]=useState<ILocation>(
          {latitude:0,
              longitude:0
          }
      )
       const [deliveryBoyLocation,setDeliveryBoyLocation]=useState<ILocation>(
          {latitude:0,
              longitude:0
          }
       )

  useEffect(() => {

    const getOrder = async () => {
      try {
        const result = await axios.get(
          `/api/user/get-order/${orderId}`
        )

        setOrder(result.data)
       setUserLocation({
  latitude: result.data.address.latitude,
  longitude: result.data.address.longitude,
})

if (result.data.assignedDeliveryBoy?.location?.coordinates) {
  setDeliveryBoyLocation({
    latitude: result.data.assignedDeliveryBoy.location.coordinates[1],
    longitude: result.data.assignedDeliveryBoy.location.coordinates[0],
  })
}
      } catch (error) {
        console.log(error)
      }
    }

    if (orderId) {
      getOrder()
    }

  }, [userData?._id])

  useEffect(() => {
  const socket = getSocket()

  const handleLocationUpdate = (data: any) => {
    console.log("LIVE LOCATION:", data)

    if (!data?.location?.coordinates) {
      console.log("No coordinates received")
      return
    }

    setDeliveryBoyLocation({
      latitude: data.location.coordinates[1],
      longitude: data.location.coordinates[0],
    })
  }

  socket.on("update-deliveryBoy-location", handleLocationUpdate)

  return () => {
    socket.off("update-deliveryBoy-location", handleLocationUpdate)
  }
}, [])

useEffect(() => {
  const socket = getSocket()

  const handleStatusUpdate = (data: any) => {
    console.log("TRACK ORDER RECEIVED:", data)

    if (
      data.orderId?.toString() ===
      orderId?.toString()
    ) {
      setOrder((prev) =>
        prev
          ? {
              ...prev,
              status: data.status,
            }
          : prev
      )
    }
  }

  socket.on("order-status-update", handleStatusUpdate)

  return () => {
    socket.off(
      "order-status-update",
      handleStatusUpdate
    )
  }
}, [orderId])

useEffect(() => {
    if (!orderId) return

    const socket = getSocket()

    socket.emit("join-room", orderId)

    return () => {
        socket.emit("leave-room", orderId)
    }
}, [orderId])

useEffect(() => {

    const socket = getSocket()

    const handleMessage = (message: any) => {

        if (
            message.roomId?.toString() !==
            orderId?.toString()
        ) {
            return
        }

       setMessages((prev) => {
  const exists = prev?.some(
    (m) =>
      m.senderId?.toString() === message.senderId?.toString() &&
      m.time === message.time &&
      m.text === message.text
  )

  if (exists) return prev

  return [...(prev ?? []), message]
})
    }

    socket.on("send-message", handleMessage)

    return () => {
        socket.off("send-message", handleMessage)
    }

}, [orderId])
  const sendMessage = () => {

    if (!newMessage.trim()) return

    const socket = getSocket()

    const message = {
        roomId: orderId,
        text: newMessage.trim(),
        senderId: userData?._id,
        time: new Date().toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit"
        })
    }

    socket.emit("send-message", message)

    setNewMessage("")
}

    useEffect(()=>{
            const getAllMessages=async ()=>{
                try {
                   const result=await axios.post("/api/chat/messages",{roomId:orderId}) 
                   setMessages(result.data)
                } catch (error) {
                    console.log(error)
                }
            }
            getAllMessages()
        },[])

         useEffect(()=>{
            chatBoxRef.current?.scrollTo({
                top:chatBoxRef.current.scrollHeight,
                behavior:"smooth"
            })
          },[messages])

           const getSuggestion = async () => {
  setLoading(true)

  try {
    const lastMessage = messages
      ?.filter(
        (m) =>
          m.senderId?.toString() !==
          userData?._id?.toString()
      )
      ?.at(-1)

    if (!lastMessage?.text) {
      setSuggestions([])
      return
    }

    const result = await axios.post(
      "/api/chat/ai-suggestions",
      {
        message: lastMessage.text,
        role: "user",
      },
      {
        timeout: 10000,
      }
    )

    const suggestions = Array.isArray(result.data)
      ? result.data.filter(
          (item): item is string => typeof item === "string"
        )
      : []

    setSuggestions([...new Set(suggestions)])
  } catch (error) {
    console.log(error)
    setSuggestions([])
  } finally {
    setLoading(false)
  }
}
  return (
    <div className='w-full min-h-screen bg-linear-to-b from-green-50 to-white'>
        <div className='max-w-3xl mx-auto pb-24'>
            <div className='sticky top-0 z-50 bg-white/90 backdrop-blur-xl border-b border-gray-100 shadow-sm px-4 py-4 flex items-center gap-3'>
              <button className='p-2 bg-green-100 rounded-full' onClick={()=>router.back()}><ArrowLeft className='text-green-700' size={20}/></button>
              <div>
                 <h2>Track Order</h2>
                 <p className='text-sm text-gray-600'>order#{order?._id?.toString().slice(-6)} <span className='px-3 py-1 rounded-full bg-green-100 text-green-700 text-xs font-semibold'>
  {order?.status}
</span></p>
              </div>
             
            </div>
            <div className='px-4 mt-24'>
             <div className='rounded-3xl overflow-hidden border shadow mb-6'>
                <LiveMap userLocation={userLocation} deliveryBoyLocation={deliveryBoyLocation}/>
              </div>

    <div className='bg-white rounded-3xl shadow-lg border p-4 h-[500px] flex flex-col'>

   
    <div className='flex items-center gap-3 px-5 py-4 border-b bg-gradient-to-r from-green-50 to-white'>
      <div className='w-3 h-3 rounded-full bg-green-500 animate-pulse'></div>

      <div>
        <h3 className='font-semibold text-gray-800'>
          Delivery Chat
        </h3>

        <p className='text-xs text-gray-500'>
          Real-time conversation
        </p>
      </div>
    </div>

         <div className='flex justify-between items-center mb-3 mt-3'>
                <span className='font-semibold text-gray-700 text-sm'>Quick Replies</span>
                <motion.button
                onClick={getSuggestion}
                whileTap={{scale:0.9}}
                disabled={loading}
                className='px-3 py-1 text-xs flex items-center gap-1 bg-purple-100 text-purple-700 rounded-full shadow-sm border-purple-200'><Sparkle size={14}/> {loading?<Loader className="w-5 h-5 animate-spin"/>:"AI suggest"}</motion.button>
            </div>
    
            <div className="flex gap-2 flex-wrap mb-3">
                {suggestions.map((s,i)=>(
    <motion.button
    type="button"
    className="px-3 py-1 text-xs bg-green-50 border border-green-200 cursor-pointer text-green-700 rounded-full"
    onClick={() => {
      setNewMessage(s)
      inputRef.current?.focus()
    }}
    whileTap={{scale:0.92}}
    key={s}>
        {s}
    </motion.button>
))}
                {!loading && suggestions.length === 0 && (
  <p className="text-xs text-gray-400">
    No suggestions available
  </p>
)}
            </div>

    <div className='flex-1 overflow-y-auto px-5 py-4 space-y-4 bg-gradient-to-b from-gray-50 to-white' ref={chatBoxRef}>
        <AnimatePresence>
            {messages?.map((message,index)=>(
                <motion.div
               key={
  message._id?.toString() ||
  `${message.senderId}-${message.time}-${index}`
}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0}}
                transition={{ duration: 0.2 }}
                className={`flex ${message.senderId.toString()===userData?._id?.toString()?"justify-end":"justify-start"}`}
                >
                    <div
className={`
px-4 py-3
max-w-[75%]
rounded-3xl
shadow-md
${
message.senderId.toString()===userData?._id?.toString()
? "bg-gradient-to-r from-green-500 to-green-600 text-white rounded-br-md"
: "bg-blue-200 border border-gray-200 text-gray-800 rounded-bl-md"
}
`}
>
                        <p>{message.text}</p>
                        <p className='text-[10px] opacity-70 mt-1 text-right'>{message.time}</p>
                    </div>
                </motion.div>
            ))}
        </AnimatePresence>
    </div>




        <div className='flex gap-2 mt-3 border-t pt-3'>
            <input
  ref={inputRef}
  type="text"
  placeholder='Type a Message...'
  className='flex-1 bg-gray-100 px-4 py-2 rounded-xl outline-none focus:ring-2 focus:ring-green-500'
  value={newMessage}
  onChange={(e)=>setNewMessage(e.target.value)}
  onKeyDown={(e) => {
  if (e.key === "Enter" && !e.shiftKey) {
    e.preventDefault()
    sendMessage()
  }
}}
/>
           <button
  className="bg-green-600 hover:bg-green-700 shadow-md hover:shadow-lg transition-all duration-200 p-3 rounded-xl text-white disabled:bg-gray-300 disabled:text-gray-500 disabled:shadow-none"
  onClick={sendMessage}
  disabled={!newMessage.trim()}
>
  <Send size={18} strokeWidth={2.5} />
</button>
        </div>
    </div>

            </div>
        </div>
    </div>
  )
}

export default TrackOrder