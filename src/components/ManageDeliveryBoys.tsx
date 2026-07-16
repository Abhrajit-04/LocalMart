"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import Image from "next/image";
import { useRouter } from "next/navigation";

interface IDeliveryBoy {
  _id: string;
  name: string;
  email: string;
  mobile: string;
  image?: string;
  isOnline: boolean;
  isActive: boolean;
}

export default function ManageDeliveryBoys() {
  const router = useRouter();

  const [deliveryBoys, setDeliveryBoys] = useState<IDeliveryBoy[]>([]);
  const [search, setSearch] = useState("");

  useEffect(() => {
    const getDeliveryBoys = async () => {
      try {
        const result = await axios.get(
          "/api/admin/get-delivery-boys"
        );

        setDeliveryBoys(result.data);
      } catch (error) {
        console.log(error);
      }
    };

    getDeliveryBoys();
  }, []);

  const filteredDeliveryBoys = deliveryBoys.filter((boy) =>
    boy.name.toLowerCase().includes(search.toLowerCase())
  );

 return (
  <div className="min-h-screen bg-gray-100">

    <div className="max-w-7xl mx-auto px-6 pt-28 pb-16">
      {/* Header */}

      <div className="flex justify-between items-center mb-8">

        <div>

          <h1 className="text-5xl font-black">
            Delivery Boys
          </h1>

          <div className="mt-4">

  <span
    className="
    inline-flex
    items-center
    rounded-full
    bg-green-100
    text-green-700
    px-4
    py-2
    font-semibold"
  >
    🚚 {deliveryBoys.length} Delivery Partners
  </span>

</div>

        </div>

      </div>

      {/* Search */}

      {/* Search */}

<div
className="
bg-white
rounded-3xl
shadow-md
border
border-gray-100
p-6
mb-8"
>

<input
placeholder="Search delivery boy..."
value={search}
onChange={(e)=>setSearch(e.target.value)}
className="
w-full
lg:w-[420px]
rounded-2xl
border
border-gray-200
bg-white
px-6
py-4
shadow-sm
outline-none
focus:outline-none
focus:ring-4
focus:ring-green-500/20
focus:border-green-500
transition-all
duration-300"
/>

</div>
      {/* Cards */}

      <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-8">

        {filteredDeliveryBoys.map((boy) => (

          <div
            key={boy._id}
            className="
            bg-white
            rounded-3xl
            border
            border-gray-100
            shadow-md
            hover:shadow-2xl
hover:-translate-y-2
hover:scale-[1.02]
            transition-all
            duration-300
            p-6"
          >

            <Image
              src={boy.image || "/profile.png"}
              alt={boy.name}
              width={120}
              height={120}
              className="
              w-28
              h-28
              rounded-full
              object-cover
              mx-auto"
            />

            <h2 className="text-2xl font-bold text-center mt-5">
              {boy.name}
            </h2>

            <p className="text-gray-500 text-center">
              {boy.email}
            </p>

            <p className="text-gray-500 text-center">
              {boy.mobile}
            </p>

            <div className="flex justify-center mt-5">

              <span
                className={`px-4 py-2 rounded-full text-sm font-semibold ${
                  boy.isOnline
                    ? "bg-green-100 text-green-700"
                    : "bg-red-100 text-red-700"
                }`}
              >
                {boy.isOnline ? "🟢 Online" : "🔴 Offline"}
              </span>

            </div>

            <div className="grid grid-cols-2 gap-3 mt-6">

              <button
                onClick={() =>
                  router.push(
                    `/admin/delivery-boys/${boy._id}`
                  )
                }
               className="
bg-blue-600
hover:bg-blue-700
hover:shadow-lg
active:scale-95
transition-all
duration-300
text-white
py-3
rounded-2xl
font-semibold"
              >
                View
              </button>

              <button
                className="
bg-red-600
hover:bg-red-700
hover:shadow-lg
active:scale-95
transition-all
duration-300
text-white
py-3
rounded-2xl
font-semibold"
              >
                Suspend
              </button>

            </div>

          </div>

        ))}

      </div>

      {filteredDeliveryBoys.length === 0 && (

        <div className="bg-white rounded-3xl shadow p-16 text-center mt-8">

          <h2 className="text-3xl font-bold">
            No Delivery Boys Found
          </h2>

          <p className="text-gray-500 mt-2">
            Try another search.
          </p>

        </div>

      )}

    </div>
    </div>
  );
}