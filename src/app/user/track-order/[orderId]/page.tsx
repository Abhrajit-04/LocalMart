'use client'

import LiveMap from '@/components/LiveMap';
import { getSocket } from '@/lib/socket';
import { IUser } from '@/models/user.model';
import { RootState } from '@/redux/store';
import axios from 'axios'
import { ArrowLeft } from 'lucide-react';
import mongoose from 'mongoose';
import { useParams, useRouter } from 'next/navigation'
import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux';

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
            <div className='px-4 mt-6'>
              <div className='rounded-3xl overflow-hidden border shadow'>
                <LiveMap userLocation={userLocation} deliveryBoyLocation={deliveryBoyLocation}/>
              </div>
            </div>
        </div>
    </div>
  )
}

export default TrackOrder