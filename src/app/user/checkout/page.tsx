"use client";
import React, { useState, useEffect } from "react";
import { motion } from "motion/react";
import {
  ArrowLeft,
  Building,
  CreditCard,
  Home,
  Loader2,
  LocateFixed,
  MapPin,
  Navigation,
  Phone,
  PinIcon,
  Truck,
  User,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import dynamic from "next/dynamic";
import { LatLngExpression } from "leaflet";
import { useMap } from "react-leaflet";
import axios from "axios";


const MapContainer = dynamic(
  () => import("react-leaflet").then((mod) => mod.MapContainer),
  { ssr: false }
);

const TileLayer = dynamic(
  () => import("react-leaflet").then((mod) => mod.TileLayer),
  { ssr: false }
);
const Marker = dynamic(
  () => import("react-leaflet").then((mod) => mod.Marker),
  { ssr: false }
);

function Checkout() {
  const router = useRouter();
  const { userData } = useSelector((state: RootState) => state.user);
  const { subTotal,deliveryFee,finalTotal,carData } = useSelector((state: RootState) => state.cart);
  const [address, setAddress] = useState({
    fullName: "",
    mobile: "",
    city: "",
    state: "",
    pincode: "",
    fullAddress: "",
  });

  const [searchLoading,setSearchLoading]=useState(false)

  const [searchQuery,setSearchQuery]=useState("")
  useEffect(() => {
    if (userData) {
      setAddress((prev) => ({
        ...prev,
        fullName: userData.name || "",
        mobile: userData.mobile || "",
      }));
    }
  }, [userData]);
  const [position,setPosition]=useState<[number,number]|null>(null)
  const [paymentMethod,setPaymentMethod]=useState<"cod" | "online">("cod")

 useEffect(() => {
  if (!navigator.geolocation) {
    console.log("Geolocation not supported")
    return
  }

  navigator.geolocation.getCurrentPosition(
    (pos) => {
      const { latitude, longitude } = pos.coords
      setPosition([latitude, longitude])
    },
    (err) => {
      if (err.code === 1) {
        alert("Location permission denied ❌")
      } else if (err.code === 2) {
        alert("Location unavailable ⚠️")
      } else if (err.code === 3) {
        alert("Location request timed out ⏳")
      } else {
        console.log("Location error:", err)
      }
    },
    {
      enableHighAccuracy: false,
      maximumAge: 60000,
      timeout: 15000
    }
  )
}, [])
useEffect(() => {
  import("leaflet/dist/leaflet.css");
}, []);

const [markerIcon, setMarkerIcon] = useState<any>(null)

useEffect(() => {
  const loadIcon = async () => {
    const L = await import("leaflet")

    const icon = new L.Icon({
      iconUrl: "https://cdn-icons-png.flaticon.com/128/2642/2642502.png",
      iconSize: [40, 40],
      iconAnchor: [20, 40],
    })

    setMarkerIcon(icon)
  }

  loadIcon()
}, [])

const DraggableMarker:React.FC=()=>{
      const map=useMap()
      useEffect(()=>{
        map.setView(position as LatLngExpression,15,{animate:true})
      },[position,map])

return markerIcon && <Marker icon={markerIcon} position={position as LatLngExpression} draggable={true} eventHandlers={{dragend:(e:L.LeafletEvent)=>{
        const marker=e.target as L.Marker
       const{lat,lng}=marker.getLatLng()
       setPosition([lat,lng])
      }}} />
}

const handleSearchQurery=async ()=>{
  setSearchLoading(true)
  const { OpenStreetMapProvider } = await import("leaflet-geosearch")
  const provider=new OpenStreetMapProvider()
  const results = await provider.search({ query: searchQuery });
  if(results){
    setSearchLoading(false)
setPosition([results[0].y,results[0].x])
  }
  
}

useEffect(()=>{
const fetchAddress=async ()=>{
  if(!position)return
  try {
    const result=await axios.get(
      `https://nominatim.openstreetmap.org/reverse?lat=${position[0]}&lon=${position[1]}&format=json`
    )

    const addr = result.data.address;

    setAddress(prev => ({
      ...prev,
      city: addr.city || addr.town || addr.village || "",
      state: addr.state || "",
      pincode: addr.postcode || "",
      fullAddress: result.data.display_name || ""
    }));

  } catch (error) {
    console.log(error)
  }
}
fetchAddress()
},[position])

const handleCod=async ()=>{
  if(!position){
    return null
  }
  try {
    const result=await axios.post("/api/user/order",{
      userId:userData?._id,
      items:carData.map(item=>(
        {
          grocery:item._id,
          name:item.name,
          price:item.price,
          unit:item.unit,
          quantity:item.quantity,
          image:item.image
        }
      )),
      paymentMethod:"cod",
      totalAmount:finalTotal,
      address:{
        fullName:address.fullName,
        mobile:address.mobile,
        city:address.city,
        state:address.state,
        fullAddress:address.fullAddress,
        pincode:address.pincode,
        latitude:position[0],
        longitude:position[1]
      },
    
    })

    router.push("/user/order-success")
  } catch (error) {
    console.log(error)
  }
}

const handleOnlinePayment=async()=>{if(!position){
    return null
  }
  try {
    const result=await axios.post("/api/user/payment",{
      userId:userData?._id,
      items:carData.map(item=>(
        {
          grocery:item._id,
          name:item.name,
          price:item.price,
          unit:item.unit,
          quantity:item.quantity,
          image:item.image
        }
      )),
      paymentMethod:"online",
      totalAmount:finalTotal,
      address:{
        fullName:address.fullName,
        mobile:address.mobile,
        city:address.city,
        state:address.state,
        fullAddress:address.fullAddress,
        pincode:address.pincode,
        latitude:position[0],
        longitude:position[1]
      },
    
    })
    window.location.href=result.data.url
  } catch (error) {
    console.log(error)
  }
}

const handleCurrentLocation=()=>{
  if (!navigator.geolocation) {
    console.log("Geolocation not supported")
    return
  }

  navigator.geolocation.getCurrentPosition(
    (pos) => {
      const { latitude, longitude } = pos.coords
      setPosition([latitude, longitude])
    },
    (err) => {
      if (err.code === 1) {
        alert("Location permission denied ❌")
      } else if (err.code === 2) {
        alert("Location unavailable ⚠️")
      } else if (err.code === 3) {
        alert("Location request timed out ⏳")
      } else {
        console.log("Location error:", err)
      }
    },
    {
      enableHighAccuracy: false,
      maximumAge: 60000,
      timeout: 15000
    }
  )
}


  return (
    <div className="w-[92%] md:w-[80%] mx-auto py-10 relative">
      <motion.button
        whileTap={{ scale: 0.97 }}
        className="absolute left-0 top-2 flex items-center gap-2 text-green-700 hover:text-green-800 font-semibold"
        onClick={() => router.push("/user/cart")}
      >
        <ArrowLeft size={16} />
        <span>Back to cart</span>
      </motion.button>

      <motion.h1
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="text-3xl md:text-4xl font-bold text-green-700 text-center mb-10"
      >
        Checkout
      </motion.h1>

      <div className="grid md:grid-cols-2 gap-8">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3 }}
          className="
    bg-white/30 backdrop-blur-xl
    rounded-3xl
    shadow-[0_10px_40px_rgba(0,0,0,0.12)]
    border border-white/40
    p-6
    transition-all duration-300
    hover:shadow-[0_15px_60px_rgba(16,185,129,0.25)]
  "
        >
          <h2 className="text-lg sm:text-xl font-semibold text-gray-800 mb-5 flex items-center gap-2">
            <MapPin className="text-green-700" /> Delivery Address
          </h2>

          <div className="space-y-4">
            <div className="relative">
              <User
                className="absolute left-3 top-3 text-green-600 opacity-80"
                size={18}
              />
              <input
                type="text"
                value={address.fullName}
                onChange={(e) =>
                  setAddress((prev) => ({ ...prev, fullName: e.target.value }))
                }
                className="
  pl-10 w-full
  rounded-lg
  p-3 text-sm

  bg-white
  border border-gray-300
  text-gray-800 placeholder-gray-400

  shadow-sm

  focus:outline-none
  focus:border-green-500
  focus:ring-2 focus:ring-green-200

  hover:border-gray-400

  transition-all duration-200
"
              />
            </div>
            <div className="relative">
              <Phone
                className="absolute left-3 top-3 text-green-600 opacity-80"
                size={18}
              />
              <input
                type="text"
                value={address.mobile}
                onChange={(e) =>
                  setAddress((prev) => ({ ...prev, mobile: e.target.value }))
                }
                className="
  pl-10 w-full
  rounded-lg
  p-3 text-sm

  bg-white
  border border-gray-300
  text-gray-800 placeholder-gray-400

  shadow-sm

  focus:outline-none
  focus:border-green-500
  focus:ring-2 focus:ring-green-200

  hover:border-gray-400

  transition-all duration-200
"
              />
            </div>
            <div className="relative">
              <Home
                className="absolute left-3 top-3 text-green-600 opacity-80"
                size={18}
              />
              <input
                type="text"
                value={address.fullAddress}
                placeholder="Enter your Address"
                onChange={(e) =>
                  setAddress((prev) => ({ ...prev, fullAddress: e.target.value }))
                }
                className="
  pl-10 w-full
  rounded-lg
  p-3 text-sm

  bg-white
  border border-gray-300
  text-gray-800 placeholder-gray-400

  shadow-sm

  focus:outline-none
  focus:border-green-500
  focus:ring-2 focus:ring-green-200

  hover:border-gray-400

  transition-all duration-200
"
              />
            </div>
            <div className="grid grid-cols-3 gap-3 mt-1">
              <div className="relative">
                <Building
                  className="absolute left-3 top-3 text-green-600 opacity-80"
                  size={18}
                />
                <input
                  type="text"
                  placeholder="City"
                  value={address.city}
                onChange={(e) =>
                  setAddress((prev) => ({ ...prev, city: e.target.value }))
                }
                  className="
  pl-10 w-full
  rounded-lg
  p-3 text-sm

  bg-white
  border border-gray-300
  text-gray-800 placeholder-gray-400

  shadow-sm

  focus:outline-none
  focus:border-green-500
  focus:ring-2 focus:ring-green-200

  hover:border-gray-400

  transition-all duration-200
"
                />
              </div>
              <div className="relative">
                <Navigation
                  className="absolute left-3 top-3 text-green-600 opacity-80"
                  size={18}
                />
                <input
                  type="text"
                  placeholder="State"
                  value={address.state}
                onChange={(e) =>
                  setAddress((prev) => ({ ...prev, state: e.target.value }))
                }
                  className="
  pl-10 w-full
  rounded-lg
  p-3 text-sm

  bg-white
  border border-gray-300
  text-gray-800 placeholder-gray-400

  shadow-sm

  focus:outline-none
  focus:border-green-500
  focus:ring-2 focus:ring-green-200

  hover:border-gray-400

  transition-all duration-200
"
                />
              </div>
              <div className="relative">
                <PinIcon
                  className="absolute left-3 top-3 text-green-600 opacity-80"
                  size={18}
                />
                <input
                  type="text"
                  placeholder="Pincode"
                  value={address.pincode}
                onChange={(e) =>
                  setAddress((prev) => ({ ...prev, pincode: e.target.value }))
                }
                  className="
  pl-10 w-full
  rounded-lg
  p-3 text-sm

  bg-white
  border border-gray-300
  text-gray-800 placeholder-gray-400

  shadow-sm

  focus:outline-none
  focus:border-green-500
  focus:ring-2 focus:ring-green-200

  hover:border-gray-400

  transition-all duration-200
"
                />
              </div>
            </div>
            <div className="flex gap-2 mt-3">
  <input
    type="text"
    placeholder="Search city or area..."
    className="
      flex-1
      px-4 py-3 text-sm
      rounded-xl
      bg-white
      border border-gray-300
      text-gray-800 placeholder-gray-400

      shadow-sm

      focus:outline-none
      focus:border-green-500
      focus:ring-2 focus:ring-green-200

      transition-all duration-200
    " value={searchQuery} onChange={(e)=>setSearchQuery(e.target.value)}
  />

  <button
    className="
      px-5 py-3
      rounded-xl
      bg-green-600 text-white
      font-medium text-sm

      shadow-md

      hover:bg-green-700
      hover:shadow-lg
      active:scale-[0.97]

      transition-all duration-200
    " onClick={handleSearchQurery}
  >
    {searchLoading?<Loader2 size={16} className="animate-spin"/>:"Search"}
  </button>
</div>
                <div className="relative mt-6 h-[330px] rounded-xl overflow-hidden border border-gray-200 shadow-inner">
                  {position &&  <MapContainer
                  key={position.toString()}
      center={position}
      zoom={13}
      scrollWheelZoom={true}
      className='w-full h-full rounded-xl'
    >
      <TileLayer
        attribution='&copy; OpenStreetMap contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <DraggableMarker/>
    </MapContainer>}
                <motion.button
  whileTap={{ scale: 0.9 }}
  className="
    absolute bottom-4 right-4 z-[999]

    p-3 rounded-full

    bg-white/80 backdrop-blur-lg
    border border-white/60

    text-green-700

    shadow-[0_8px_25px_rgba(0,0,0,0.15)]

    flex items-center justify-center

    transition-all duration-300 ease-out

    hover:bg-green-600
    hover:text-white
    hover:shadow-[0_12px_35px_rgba(16,185,129,0.4)]
    hover:scale-105

    active:scale-90 active:shadow-inner
  " onClick={handleCurrentLocation}
>
  <LocateFixed size={20} />
</motion.button>
                </div>
          </div>
        </motion.div>

        <motion.div
        initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3 }}
           className="
    bg-white/30 backdrop-blur-xl
    rounded-3xl
    shadow-[0_10px_40px_rgba(0,0,0,0.12)]
    border border-white/40
    h-fit
    p-6
    transition-all duration-300
    hover:shadow-[0_15px_60px_rgba(16,185,129,0.25)]
  ">
      <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center gap-2"><CreditCard className="text-green-600"/>Payment Method</h2>
      <div className="space-y-4 mb-6">
        <button onClick={()=>setPaymentMethod("online")} className={`flex items-center gap-3 w-full border rounded-lg p-3 transition-all ${paymentMethod == "online" ?"border-green-600 bg-green-50 shadow-sm":"hover:bg-gray-50"}`}>
          <CreditCard className="text-green-600"/><span className="font-medium text-gray-700">Pay Online(stripe)</span>
        </button>
        <button onClick={()=>setPaymentMethod("cod")} className={`flex items-center gap-3 w-full border rounded-lg p-3 transition-all ${paymentMethod == "cod" ?"border-green-600 bg-green-50 shadow-sm":"hover:bg-gray-50"}`}>
          <Truck className="text-green-600"/><span className="font-medium text-gray-700">Cash on Delivery</span>
        </button>
      </div>
      <div className="border-t pt-4 text-gray-700 space-y-2 text-sm sm:text-base">
        <div className="flex justify-between">
          <span className="font-semibold">Subtotal</span>
          <span className="font-semibold text-green-600">₹{subTotal}</span>
        </div>
         <div className="flex justify-between">
          <span className="font-semibold">Delivery Fee</span>
          <span className="font-semibold text-green-600">₹{deliveryFee}</span>
        </div>
         <div className="flex justify-between font-bold text-lg border-t pt-3">
          <span className="font-semibold">Final Total</span>
          <span className="font-semibold text-green-600">₹{finalTotal}</span>
        </div>
      </div>
      <motion.button whileTap={{scale:0.9}} className="w-full mt-6 bg-green-600 text-white py-3 rounded-full hover:bg-green-700 transition-all font-semibold"
      onClick={()=>{
        if(paymentMethod=="cod"){
          handleCod()
        }else{
          handleOnlinePayment()
        }
      }}>
        {paymentMethod=="cod"?"Place Order":"pay & Place Order"}
      </motion.button>
        </motion.div>
      </div>
    </div>
  );
}

export default Checkout;
