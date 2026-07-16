"use client";

import axios from "axios";
import { useState } from "react";
import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";

export default function ShopSettings({ shop }: any) {

const [form,setForm]=useState(shop);
const router = useRouter();

const updateShop=async()=>{

await axios.post(
"/api/shop/update",
form
);

alert("Updated Successfully");

}

return(

<div className="max-w-3xl mx-auto pt-28 px-6">

    <div className="flex items-center gap-4 mb-8">

  <button
    onClick={() => router.back()}
    className="
    w-12
    h-12
    rounded-xl
    bg-white
    border
    border-gray-200
    shadow-md
    hover:bg-green-50
    transition
    flex
    items-center
    justify-center"
  >
    <ArrowLeft className="text-green-700" />
  </button>

  <h1 className="text-4xl font-black">
    Shop Settings
  </h1>

</div>

<div className="bg-white rounded-3xl shadow-xl p-8">

<div className="space-y-5">

<input
className="w-full border rounded-xl p-4"
value={form.shopName}
onChange={(e)=>
setForm({...form,shopName:e.target.value})
}
/>

<input
className="w-full border rounded-xl p-4"
type="time"
value={form.openingTime}
onChange={(e)=>
setForm({...form,openingTime:e.target.value})
}
/>

<input
className="w-full border rounded-xl p-4"
type="time"
value={form.closingTime}
onChange={(e)=>
setForm({...form,closingTime:e.target.value})
}
/>

<input
className="w-full border rounded-xl p-4"
type="number"
value={form.deliveryRadius}
onChange={(e)=>
setForm({...form,deliveryRadius:Number(e.target.value)})
}
/>

<div className="flex items-center gap-4">

<label>Shop Open</label>

<input
type="checkbox"
checked={form.isOpen}
onChange={(e)=>
setForm({...form,isOpen:e.target.checked})
}
/>

</div>

<button
onClick={updateShop}
className="w-full bg-green-600 text-white rounded-xl py-4 font-bold"
>

Save Changes

</button>

</div>

</div>

</div>

)

}