"use client";

import axios from "axios";
import { useEffect, useState } from "react";
import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";

interface Props{
    orderId:string
}

export default function ShopOrderDetails({
    orderId
}:Props){

const router=useRouter();

const [order,setOrder]=useState<any>(null);

const [deliveryBoys,setDeliveryBoys]=useState<any[]>([]);

const [selectedBoy,setSelectedBoy]=useState("");

const assignDeliveryBoy = async () => {

if(!selectedBoy){

alert("Select a delivery boy");

return;

}

try{

await axios.post(

`/api/shop/assign-delivery-boy/${order._id}`,

{

deliveryBoyId:selectedBoy

}

);

alert("Assigned Successfully");

// Refresh order
const result = await axios.get(
  `/api/shop/get-order/${orderId}`
);

setOrder(result.data.order);

setSelectedBoy("");

}catch(error){

console.log(error);

}

}

useEffect(() => {

  const getOrder = async () => {

    const result = await axios.get(
      `/api/shop/get-orders/${orderId}`
    );

    setOrder(result.data.order);

    const boys = await axios.get(
      "/api/shop/get-delivery-boys"
    );

    setDeliveryBoys(boys.data);

  };

  getOrder();

}, [orderId]);

if(!order){

return <div className="p-20 text-center">
Loading...
</div>

}

return (
<div className="min-h-screen bg-gray-100">

<div className="max-w-7xl mx-auto px-6 pt-28 pb-16">

{/* Header */}

<div className="flex items-center gap-5 mb-10">

<button
onClick={()=>router.back()}
className="
p-3
rounded-2xl
bg-white
border
border-gray-200
shadow-sm
hover:shadow-lg
hover:bg-green-50
transition-all">

<ArrowLeft className="text-green-700"/>

</button>

<div>

<h1 className="text-5xl font-black">
Order Details
</h1>

<p className="text-gray-500 mt-2">
Order #{order._id.slice(-6)}
</p>

</div>

</div>


{/* Customer */}

<div className="
bg-white
rounded-3xl
shadow-md
border
border-gray-100
p-8">

<h2 className="text-2xl font-bold mb-6">
Customer Details
</h2>

<div className="grid md:grid-cols-2 gap-8">

<div className="space-y-3">

<p>
<b>Name :</b> {order.address.fullName}
</p>

<p>
<b>Phone :</b> {order.address.mobile}
</p>

<p>
<b>Payment :</b>{" "}
{order.paymentMethod==="cod"
?"Cash On Delivery"
:"Online"}
</p>

</div>

<div>

<p>
<b>Address :</b>
</p>

<p className="text-gray-500 mt-2">
{order.address.fullAddress}
</p>

</div>

</div>

</div>


{/* Order Items */}

<div className="
bg-white
rounded-3xl
shadow-md
border
border-gray-100
p-8
mt-8">

<h2 className="text-2xl font-bold mb-6">

Order Items

</h2>

<div className="space-y-4">

{order.items.map((item:any,index:number)=>(

<div
key={index}
className="
flex
justify-between
items-center
rounded-2xl
bg-gray-50
border
border-gray-100
p-4">

<div className="flex items-center gap-4">

<img
src={item.image}
className="
w-16
h-16
rounded-xl
object-cover"
/>

<div>

<h3 className="font-bold">
{item.name}
</h3>

<p className="text-gray-500">

{item.quantity} × {item.unit}

</p>

</div>

</div>

<h3 className="font-bold text-green-700">

₹{Number(item.price)*item.quantity}

</h3>

</div>

))}

</div>

</div>


{/* Order Summary */}

<div className="
bg-white
rounded-3xl
shadow-md
border
border-gray-100
p-8
mt-8">

<h2 className="text-2xl font-bold mb-6">

Order Summary

</h2>

<div className="space-y-4">

<div className="flex justify-between">

<span>Payment</span>

<span>

{order.isPaid?"Paid":"Unpaid"}

</span>

</div>

<div className="flex justify-between">

<span>Status</span>

<span className="capitalize">

{order.status}

</span>

</div>

<hr/>

<div className="flex justify-between">

<h2 className="text-xl font-bold">

Total

</h2>

<h2 className="text-2xl font-black text-green-700">

₹{order.totalAmount}

</h2>

</div>

</div>

</div>


{/* Assign Delivery Boy */}

{/* Delivery Boy */}

<div
className="
bg-white
rounded-3xl
shadow-md
border
border-gray-100
p-8
mt-8"
>

<h2 className="text-2xl font-bold mb-6">

Delivery Partner

</h2>

{order.assignedDeliveryBoy ? (

<div className="bg-green-50 border border-green-200 rounded-2xl p-6">

<div className="flex justify-between items-center">

<div>

<h3 className="text-xl font-bold">

{order.assignedDeliveryBoy.name}

</h3>

<p className="text-gray-500 mt-1">

📞 {order.assignedDeliveryBoy.mobile}

</p>

<span
className={`inline-block mt-4 px-4 py-2 rounded-full text-sm font-semibold ${
order.assignedDeliveryBoy.isOnline
? "bg-green-100 text-green-700"
: "bg-red-100 text-red-700"
}`}
>

{order.assignedDeliveryBoy.isOnline
? "🟢 Online"
: "🔴 Offline"}

</span>

</div>

<a
href={`tel:${order.assignedDeliveryBoy.mobile}`}
className="
bg-green-600
hover:bg-green-700
text-white
px-6
py-3
rounded-2xl
font-semibold"
>

📞 Call

</a>

</div>

</div>

) : (

<>

<select

value={selectedBoy}

onChange={(e)=>setSelectedBoy(e.target.value)}

className="
w-full
rounded-2xl
border
border-gray-200
px-5
py-4
outline-none
focus:ring-4
focus:ring-green-500/20"

>

<option value="">

Choose Delivery Boy

</option>

{deliveryBoys.map((boy:any)=>(

<option
key={boy._id}
value={boy._id}
>

{boy.name}

</option>

))}

</select>

<button

onClick={assignDeliveryBoy}

className="
mt-6
w-full
rounded-2xl
bg-green-600
hover:bg-green-700
text-white
font-bold
py-4"

>

Assign Delivery Boy

</button>

</>

)}

</div>

</div>

</div>
)

}