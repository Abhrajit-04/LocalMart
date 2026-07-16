"use client";

import axios from "axios";
import { ArrowLeft, Phone } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

interface Props {
  deliveryBoyId: string;
}

export default function DeliveryBoyDetails({
  deliveryBoyId,
}: Props) {

  const router = useRouter();

  const [data, setData] = useState<any>(null);

  const suspendDeliveryBoy = async () => {

  try {

    const result = await axios.post(
      `/api/admin/suspend-delivery-boy/${deliveryBoyId}`
    );

    alert(result.data.message);

    const updated = await axios.get(
      `/api/admin/get-delivery-boys/${deliveryBoyId}`
    );

    setData(updated.data);

  } catch (error: any) {

    alert(
      error.response?.data?.message ||
      "Something went wrong."
    );

  }

};

  useEffect(() => {

    const getDeliveryBoy = async () => {

      try {

        const result = await axios.get(
          `/api/admin/get-delivery-boys/${deliveryBoyId}`
        );

        setData(result.data);

      } catch (error) {
        console.log(error);
      }

    };

    getDeliveryBoy();

  }, [deliveryBoyId]);

  if (!data)
    return (
      <div className="p-20 text-center">
        Loading...
      </div>
    );

  const {
    deliveryBoy,
    assignedOrders,
    completedOrders,
    pendingOrders,
  } = data;

 return (
  <div className="min-h-screen bg-gray-100">

    <div className="max-w-7xl mx-auto px-6 pt-28 pb-16">

        {/* Header */}

<div className="flex items-center gap-5 mb-10">

  <button
    onClick={() => router.back()}
    className="
    p-3
    rounded-2xl
    bg-white
    border
    border-gray-200
    shadow-sm
    hover:shadow-lg
    hover:bg-green-50
    hover:-translate-x-1
    transition-all
    duration-300"
  >
    <ArrowLeft className="text-green-700"/>
  </button>

  <div>

    <h1 className="text-5xl font-black">
      Delivery Boy Details
    </h1>

    <p className="text-gray-500 mt-2">
      Track performance and assigned deliveries.
    </p>

  </div>

</div>

        {/* Profile */}

        <div
className="
bg-white
rounded-3xl
border
border-gray-100
shadow-md
hover:shadow-xl
transition-all
duration-300
p-8">

          <div className="flex flex-col lg:flex-row gap-8 items-center">

            <Image
              src={
                deliveryBoy.image ||
                "/profile.png"
              }
              alt={deliveryBoy.name}
              width={140}
              height={140}
             className="
w-40
h-40
rounded-full
object-cover
border-4
border-green-100
shadow-lg"
            />

            <div>

              <h1 className="text-5xl font-black">
                {deliveryBoy.name}
              </h1>

              <p className="mt-3 text-gray-500">
                {deliveryBoy.email}
              </p>

              <p className="text-gray-500">
                {deliveryBoy.mobile}
              </p>

              <span
                className={`inline-block mt-4 px-4 py-2 rounded-full ${
                  deliveryBoy.isOnline
                    ? "bg-green-100 text-green-700"
                    : "bg-red-100 text-red-700"
                }`}
              >
                {deliveryBoy.isOnline
  ? "🟢 Online"
  : "🔴 Offline"}
              </span>

              <span
className={`

ml-3
inline-block
mt-4
px-4
py-2
rounded-full

${
deliveryBoy.isActive
?

"bg-blue-100 text-blue-700"

:

"bg-red-100 text-red-700"

}

`}
>

{deliveryBoy.isActive

?

"Active"

:

"Suspended"}

</span>

<div className="flex gap-4 mt-6">

<a
href={`tel:${deliveryBoy.mobile}`}
className="
bg-green-600
hover:bg-green-700
hover:shadow-lg
text-white
px-6
py-3
rounded-2xl
font-semibold
transition-all"
>
📞 Call
</a>

<button
onClick={suspendDeliveryBoy}
className={`
px-6
py-3
rounded-2xl
font-semibold
text-white
transition-all
${
deliveryBoy.isActive
? "bg-red-600 hover:bg-red-700"
: "bg-blue-600 hover:bg-blue-700"
}
`}
>
{deliveryBoy.isActive
? "🚫 Suspend"
: "✅ Activate"}
</button>

</div>

            </div>

          </div>

        </div>

        {/* Stats */}

        <div className="grid md:grid-cols-3 gap-6 mt-8">

          <div className="
bg-white
rounded-3xl
border
border-gray-100
shadow-md
hover:shadow-xl
hover:-translate-y-1
transition-all
duration-300
p-8">

            <h3 className="text-gray-500 text-center font-medium">
              Assigned Orders
            </h3>

            <h1 className="text-6xl font-black mt-4 text-center">
              {assignedOrders.length}
            </h1>

          </div>

          <div className="
bg-white
rounded-3xl
border
border-gray-100
shadow-md
hover:shadow-xl
hover:-translate-y-1
transition-all
duration-300
p-8">

            <h3 className="text-gray-500 text-center font-medium">
              Completed
            </h3>

            <h1 className="text-5xl font-black mt-3 text-green-700">
              {completedOrders.length}
            </h1>

          </div>

          <div className="
bg-white
rounded-3xl
border
border-gray-100
shadow-md
hover:shadow-xl
hover:-translate-y-1
transition-all
duration-300
p-8">

            <h3 className="text-gray-500 text-center font-medium">
              Pending
            </h3>

            <h1 className="text-5xl font-black mt-3 text-orange-500">
              {pendingOrders.length}
            </h1>

          </div>

        </div>

        {/* Orders */}

        <div className="
bg-white
rounded-3xl
border
border-gray-100
shadow-md
hover:shadow-xl
transition-all
duration-300
p-8
mt-8">

          <h2 className="text-3xl font-bold mb-8">
            Assigned Orders
          </h2>

          <div className="space-y-4">

            {assignedOrders.map((order: any) => (

              <div
                key={order._id}
                className="
flex
justify-between
items-center
rounded-2xl
border
border-gray-100
bg-gray-50
hover:bg-green-50
hover:shadow-md
transition-all
duration-300
p-6"
              >

                <div>

                  <h3 className="font-bold">
                    Order #{order._id.slice(-6)}
                  </h3>

                  <p className="text-gray-500">
                    {order.address.fullName}
                  </p>

                </div>

               <span
className={`px-4 py-2 rounded-full text-sm font-semibold capitalize ${
order.status==="pending"
? "bg-yellow-100 text-yellow-700"
: order.status==="out of delivery"
? "bg-blue-100 text-blue-700"
: "bg-green-100 text-green-700"
}`}
>
{order.status}
</span>

              </div>

            ))}

          </div>

        </div>

        {/* Call */}

        
      </div>

    </div>
  );
}