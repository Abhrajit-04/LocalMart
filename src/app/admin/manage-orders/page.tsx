'use client'
import AdminOrderCard from '@/components/AdminOrderCard'
import { getSocket } from '@/lib/socket'
import { IUser } from '@/models/user.model'
import axios from 'axios'
import { ArrowLeft } from 'lucide-react'
import mongoose from 'mongoose'
import { useRouter } from 'next/navigation'
import React, { useEffect, useState } from 'react'
interface IOrder{
    _id?:mongoose.Types.ObjectId
    user:mongoose.Types.ObjectId
    items:[
        {
            grocery:mongoose.Types.ObjectId,
            name:string,
            price:string,
            unit:string,
            image:string,
            quantity:number
        }
    ]
    ,
    isPaid:boolean,
    totalAmount:number,
    paymentMethod:"cod" | "online"
    address:{
        fullName:string,
        mobile:string,
        city:string,
        state:string,
        pincode:string,
        fullAddress:string,
        latitude:number,
        longitude:number
    }
    assignment?:mongoose.Types.ObjectId
    assignedDeliveryBoy?: IUser
    status:"pending" | "out of delivery" | "delivered"
    createdAt?:Date
    updatedAt?:Date
}

function ManageOrder() {

    const [orders,setOrders]=useState<IOrder[]>([])

    const [search,setSearch]=useState("")

    const [status,setStatus]=useState("all")

    const router=useRouter()
    useEffect(()=>{
        const getOrders=async ()=>{
            try {
                const result=await axios.get("/api/admin/get-orders")
                setOrders(result.data)
            } catch (error) {
                console.log(error)
            }
        }
        getOrders()
    },[])

   useEffect(() => {
  const socket = getSocket()

  const handleNewOrder = (newOrder: IOrder) => {
    console.log("NEW ORDER RECEIVED:", newOrder)

    setOrders((prev) => [newOrder, ...prev])
  }

  const handleOrderAssigned = ({
    orderId,
    assignedDeliveryBoy,
  }: any) => {
    console.log("ORDER ASSIGNED EVENT:", orderId)

    setOrders((prev) =>
      prev.map((o) =>
        o._id?.toString() === orderId?.toString()
          ? { ...o, assignedDeliveryBoy }
          : o
      )
    )
  }

  socket.on("new-order", handleNewOrder)
  socket.on("order-assigned", handleOrderAssigned)

  const handleAdminOrderUpdated = async () => {
  try {
    const result = await axios.get("/api/admin/get-orders");
    setOrders(result.data);
  } catch (error) {
    console.log(error);
  }
};

socket.on("admin-order-updated", handleAdminOrderUpdated);

  return () => {
    socket.off("new-order", handleNewOrder);
  socket.off("order-assigned", handleOrderAssigned);
  socket.off("admin-order-updated", handleAdminOrderUpdated);
  }
}, [])
    useEffect(():any=>{
  const socket=getSocket()

  socket.on("order-status-update",(data)=>{
    setOrders((prev)=>
      prev.map((o)=>
        o._id?.toString() === data.orderId
          ? { ...o, status: data.status }
          : o
      )
    )
  })

  return ()=>socket.off("order-status-update")
},[])

const filteredOrders = orders.filter((order) => {

  const searchMatch =
    order.address.fullName
      .toLowerCase()
      .includes(search.toLowerCase());

  const statusMatch =
    status === "all" ||
    order.status === status;

  return searchMatch && statusMatch;

});
  return (
    <div className="min-h-screen bg-gray-100">
       <div className="pt-28 pb-10 max-w-7xl mx-auto px-6">

<div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">

<div className="flex items-center gap-4">

<button
className="
p-3
rounded-2xl
bg-white
border
border-gray-200
shadow-sm
hover:shadow-lg
hover:-translate-x-1
hover:bg-green-50
transition-all
duration-300"
onClick={()=>router.push("/")}
>

<ArrowLeft className="text-green-700"/>

</button>

<div>

<h1 className="text-5xl font-black">

Manage Orders

</h1>

<p className="text-gray-500 mt-2">

Track, assign and manage every customer order.

</p>

<p
className="
inline-flex
items-center
mt-4
rounded-full
bg-green-100
text-green-700
px-4
py-2
font-semibold">
📦 {orders.length} Orders
</p>

</div>

</div>

</div>

</div>
                <div className="max-w-7xl mx-auto px-6 pt-10 pb-16 space-y-8"> 

                  <div
className="
bg-white
rounded-3xl
shadow-md
hover:shadow-lg
transition-all
duration-300
border
border-gray-100
p-6
flex
flex-col
lg:flex-row
gap-5
mb-8">

<input
placeholder="Search customer..."
value={search}
onChange={(e)=>setSearch(e.target.value)}
className="
flex-1
rounded-2xl
border
border-gray-200
bg-white
px-5
py-4
shadow-sm
outline-none
focus:outline-none
focus:border-green-500
focus:ring-4
focus:ring-green-500/20
transition-all
duration-300"
/>

<select
value={status}
onChange={(e)=>setStatus(e.target.value)}
className="
rounded-2xl
border
border-gray-200
bg-white
px-5
py-4
shadow-sm
outline-none
focus:outline-none
focus:ring-4
focus:ring-green-500/20
focus:border-green-500
transition-all
duration-300
"
>

<option value="all">
All Status
</option>

<option value="pending">
Pending
</option>

<option value="out of delivery">
Out For Delivery
</option>

<option value="delivered">
Delivered
</option>

</select>

</div>

                    <div className='space-y-8'>

  {filteredOrders.map((order) => (

  <AdminOrderCard
    key={order._id?.toString()}
    order={order}
  />

))}

{filteredOrders.length === 0 && (

<div className="bg-white rounded-3xl p-16 text-center shadow">

<h2 className="text-3xl font-bold">
No Orders Found
</h2>

<p className="text-gray-500 mt-2">
There are no orders matching your search.
</p>

</div>

)}

</div>
                </div>
            
    </div>
  )
}

export default ManageOrder