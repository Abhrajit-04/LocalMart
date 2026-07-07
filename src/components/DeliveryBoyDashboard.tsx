'use client'
import { getSocket } from '@/lib/socket'
import { RootState } from '@/redux/store'
import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import LiveMap from './LiveMap'
import DeliveryChat from './DeliveryChat'
import { Loader } from 'lucide-react'
import { Bar, BarChart, Legend, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import { useRouter } from 'next/navigation'

interface ILocation{
    latitude:number,
    longitude:number
}
function DeliveryBoyDashboard({earning}:{earning:number}) {
    const router = useRouter()
    const [assignments,setAssignments]=useState<any[]>([])
    const {userData}=useSelector((state:RootState)=>state.user)
    const [activeOrder,setActiveOrder]=useState<any>(null)
    const [showOtpBox,setShowOtpBox]=useState(false)
    const [otp,setOtp]=useState("")
    const [otpError,setOtpError]=useState("")
    const [sendOtpLoading,setSendOtpLoading]=useState(false)
    const [verifyOtpLoading,setVerifyOtpLoading]=useState(false)
    const [deliveryCompleted,setDeliveryCompleted]=useState(false)
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
    const fetchAssignments=async ()=>{
            try {
               const result=await axios.get("/api/delivery/get-assignments") 
                setAssignments(result.data)
            } catch (error) {
               console.log(error) 
            }
        }
    
    useEffect(()=>{
        if(!userData?._id)return
        if(!navigator.geolocation)return
        const socket = getSocket()
           const watcher= navigator.geolocation.watchPosition((pos)=>{
                const lat=pos.coords.latitude
                const lon=pos.coords.longitude
                setDeliveryBoyLocation({
                    latitude:lat,
                    longitude:lon
                })
                socket.emit("update-location",{
                    userId:userData?._id,
                    latitude:lat,
                    longitude:lon
                })
            },(err)=>{
                console.log(err)
            },{enableHighAccuracy:true})
        return ()=>navigator.geolocation.clearWatch(watcher)
    },[userData?._id])
   useEffect(() => {
    const socket = getSocket()

   const handleNewAssignment = (deliveryAssignment:any) => {

    if (!deliveryAssignment?.order) {
        return
    }

    setDeliveryCompleted(false)

    setAssignments((prev) => {

        const exists = prev.some(
            item => item?._id?.toString() ===
                    deliveryAssignment?._id?.toString()
        )

        if (exists) {
            return prev
        }

        return [...prev, deliveryAssignment]
    })
}

    socket.on("new-assignment", handleNewAssignment)

    return () => {
        socket.off("new-assignment", handleNewAssignment)
    }
}, [])

    const handleAccept=async (id:string)=>{
        try {
            const result=await axios.get(`/api/delivery/assignment/${id}/accept-assignment`)
            fetchcurrentOrder()
        } catch (error) {
            console.log(error)
        }
    }
    

    const fetchcurrentOrder=async ()=>{
        try {
           const result=await axios.get("/api/delivery/current-order")
           if(result.data.active){
                setActiveOrder(result.data.assignment)
                setUserLocation({
                    latitude:result.data.assignment.order.address.latitude,
                    longitude:result.data.assignment.order.address.longitude
                })
           }else{
    setActiveOrder(null)
}
           
        } catch (error) {
            console.log(error)
        }
    }

   

    useEffect(()=>{
        fetchcurrentOrder()
        fetchAssignments()
    },[userData])

    const sendOtp=async ()=>{
        setSendOtpLoading(true)
        try {
            const result=await axios.post("/api/delivery/otp/send",{orderId:activeOrder.order._id})
            console.log(result.data)
            setShowOtpBox(true)
            setSendOtpLoading(false)
        } catch (error) {
            console.log(error)
            setSendOtpLoading(false)
        }
    }

    const verifyOtp=async()=>{  

        if (otp.length !== 4) {
        setOtpError("Please enter a valid 4-digit OTP")
        return
    }

        setVerifyOtpLoading(true)
        try {
            const result = await axios.post("/api/delivery/otp/verify", {
    orderId: activeOrder.order._id,
    otp
})

setShowOtpBox(false)
setOtp("")
setOtpError("")

await fetchcurrentOrder()
await fetchAssignments()

router.refresh()

setDeliveryCompleted(true)

setVerifyOtpLoading(false)

        } catch (error) {
            setOtpError("Otp Verification Error")
            setVerifyOtpLoading(false)
            await fetchcurrentOrder()
        }
    }

    if(!activeOrder && assignments.length===0){

        const todayEarning=[
            {name:"Today",
             earning,
             deliveries:earning/40
            }
        ]
        return(
            <div
className="
pt-28
pb-10
min-h-screen
bg-gradient-to-br
from-white
via-green-50
to-lime-50
px-6
flex
flex-col
items-center
">

    
                <div className='max-w-xl w-full text-center'>
                    <h2 className="
text-4xl
font-black
tracking-tight
text-gray-800
">No Active Deliveries 🚛</h2>
                    <p className="
mt-3
text-lg
text-gray-500
mb-10
">Stay Online to receive new orders</p>

                    <div
className="
rounded-[32px]
bg-white/60
backdrop-blur-xl
border
border-white/50
shadow-[0_20px_60px_rgba(0,0,0,0.08)]
p-8
">
                        <h2
className="
text-xl
font-bold
text-green-700
mb-6
">Today's Performance</h2>
                        <ResponsiveContainer width="100%" height={300}>
                              <BarChart data={todayEarning}>
                                <XAxis dataKey="name"/>
                                <YAxis/>
                                <Tooltip/>
                                <Legend/>
                                <Bar dataKey="earnings" name="Earnings (₹)"/>
                                <Bar dataKey="deliveries" name="Deliveries"/>
                              </BarChart>
                          </ResponsiveContainer>

                          <p
className="
mt-8
text-3xl
font-black
text-green-600
">{earning || 0} Earned today</p>
               
                    </div>
                </div>
            </div>
        )
    }

    if(activeOrder && userLocation){
        return (
            <div className='p-4 pt-[120px] min-h-screen bg-gray-50'>
                <div className='max-w-3xl mx-auto'>
                    <h1 className='text-2xl font-bold text-green-700 mb-2'>Active Delivery</h1>
                    <p className='text-gray-600 text-sm mb-4'>order#{activeOrder?.order?._id?.toString()?.slice(-6)}</p>

                    <div className='rounded-xl border shadow-lg overflow-hidden mb-6'>
                        <LiveMap userLocation={userLocation} deliveryBoyLocation={deliveryBoyLocation}/>
                    </div>
                    
                    <DeliveryChat orderId={activeOrder.order._id} deliveryBoyId={userData?._id!}/>
                        <div className='mt-6 bg-white rounded-xl border shadow p-6'>
                            {!activeOrder.order.deliveryOtpVerification && !showOtpBox && (
                                    <button onClick={sendOtp} className='w-full py-4 bg-green-600 text-white flex items-center justify-center rounded-lg'>
                                {sendOtpLoading? <Loader size={16} className='animate-spin text-white text-center'/>:"Mark as Delivered"}</button>
                            )}
                            {
                                showOtpBox &&
                                <div className='mt-4'>
                                    <input
type="text"
inputMode="numeric"
className='w-full py-3 border rounded-lg text-center outline-none focus:ring-2 focus:ring-blue-500'
placeholder='Enter 4-digit OTP'
value={otp}
onChange={(e)=>{
    const value = e.target.value.replace(/\D/g,"")
    setOtp(value.slice(0,4))
    setOtpError("")
}}
/>
                                    <button
disabled={otp.length !== 4 || verifyOtpLoading}
onClick={verifyOtp}
className={`w-full mt-4 py-3 rounded-lg flex items-center justify-center transition-all duration-300 font-semibold
${
otp.length !== 4 || verifyOtpLoading
?
"bg-gray-300 text-gray-500 cursor-not-allowed"
:
"bg-blue-600 hover:bg-blue-700 text-white shadow-lg"
}`}
>
{
verifyOtpLoading
?
<Loader size={18} className='animate-spin'/>
:
"Verify OTP"
}
</button>
                                        {
otpError &&
<p className='mt-2 text-sm text-red-500 text-center font-medium'>
    {otpError}
</p>
}
                                </div>
                            }

                            {activeOrder.order.deliveryOtpVerification && <div className='text-green-700 text-center font-bold'>Delivery Completed!</div>}
                            
                        </div>

                </div>
            </div>
        )
    }

if (
    deliveryCompleted &&
    assignments.length === 0
) {
    return (
        <div className='min-h-screen flex items-center justify-center bg-gray-50'>
            <div className='bg-white rounded-3xl shadow-xl border p-10 text-center max-w-md'>

                <div className='text-6xl mb-4'>
                    ✅
                </div>

                <h2 className='text-2xl font-bold text-green-700 mb-2'>
                    Delivery Completed
                </h2>

                <p className='text-gray-600'>
                    Order delivered successfully.
                    Waiting for new assignments...
                </p>

            </div>
        </div>
    )
}

  return (
    <div className='w-full min-h-screen bg-gray-50 p-4'>
        <div className='max-w-3xl mx-auto'>
            <h2 className='text-2xl font-bold mt-[120px] mb-[30px]'>Delivery Assignment</h2>
            {assignments
  ?.filter(a => a?.order?._id)
  .map(a => (
                <div key={a._id?.toString()} className='p-5 bg-white rounded-xl shadow mb-4 border'>
                    <p><b>Order Id </b> #{a?.order?._id?.toString()?.slice(-6)}</p>
                    <p className='text-gray-600'>
    {a?.order?.address?.fullAddress || "Address unavailable"}
</p>

                    <div className='flex gap-3 mt-4'>
                        <button className='flex-1 bg-green-600 text-white py-2 rounded-lg'
                        onClick={()=>handleAccept(a._id)}
                        >Accept</button>
                        <button className='flex-1 bg-red-600 text-white py-2 rounded-lg'>Reject</button>
                    </div>
                 </div>
            ))}
        </div>
    </div>
  )
}

export default DeliveryBoyDashboard