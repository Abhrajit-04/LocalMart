"use client";

import Image from "next/image";
import axios from "axios";
import { useEffect, useState } from "react";

interface Props {
  shop: any;
}

export default function ShopDetails({
  shop,
}: Props) {

    const [products, setProducts] = useState<any[]>([]);
    const [selectedProduct, setSelectedProduct] = useState<any>(null);

const [showEditModal, setShowEditModal] = useState(false);

    const approveShop = async () => {
  try {
    const result = await axios.post(
      `/api/admin/approve-shop/${shop._id}`
    );

    alert(result.data.message);

    window.location.reload();
  } catch (error: any) {
    alert(error.response?.data?.message);
  }
};

const rejectShop = async () => {
  try {
    const result = await axios.post(
      `/api/admin/reject-shop/${shop._id}`
    );

    alert(result.data.message);

    window.location.reload();
  } catch (error: any) {
    alert(
      error.response?.data?.message ||
      "Something went wrong"
    );
  }
};

const suspendShop = async () => {
  try {
    const result = await axios.post(
      `/api/admin/suspend-shop/${shop._id}`
    );

    alert(result.data.message);

    window.location.reload();
  } catch (error: any) {
    alert(
      error.response?.data?.message ||
      "Something went wrong"
    );
  }
};

const deleteProduct = async (productId: string) => {

  const confirmDelete = confirm(
    "Are you sure you want to delete this product?"
  );

  if (!confirmDelete) return;

  try {

    const result = await axios.delete(
      `/api/admin/delete-grocery/${productId}`
    );

    alert(result.data.message);

    setProducts((prev: any) =>
      prev.filter((p: any) => p._id !== productId)
    );

  } catch (error: any) {

    alert(
      error.response?.data?.message ||
      "Something went wrong"
    );

  }

};

const toggleAvailability = async (
  productId:string
)=>{

try{

const result =
await axios.post(
`/api/admin/toggle-product-status/${productId}`
);

alert(result.data.message);

setProducts((prev:any)=>

prev.map((p:any)=>

p._id===productId
? result.data.product
: p

)

);

}catch(error:any){

alert(
error.response?.data?.message
);

}

}

const saveProduct = async () => {

  try {

    const formData = new FormData();

    formData.append(
      "groceryId",
      selectedProduct._id
    );

    formData.append(
      "name",
      selectedProduct.name
    );

    formData.append(
      "category",
      selectedProduct.category
    );

    formData.append(
      "unit",
      selectedProduct.unit
    );

    formData.append(
      "price",
      selectedProduct.price
    );

    formData.append(
      "stock",
      selectedProduct.stock
    );

    formData.append(
      "isAvailable",
      String(selectedProduct.isAvailable)
    );

   const result = await axios.put(
  `/api/admin/update-grocery/${selectedProduct._id}`,
  {
    name: selectedProduct.name,
    price: Number(selectedProduct.price),
    stock: Number(selectedProduct.stock),
    category: selectedProduct.category,
    unit: selectedProduct.unit,
    isAvailable: selectedProduct.isAvailable,
  }
);

alert(result.data.message);

setProducts((prev: any[]) =>
  prev.map((p: any) =>
    p._id === selectedProduct._id
      ? result.data.grocery
      : p
  )
);

setShowEditModal(false);

  } catch(error:any){

    alert(
      error.response?.data?.message ||
      "Something went wrong"
    );

  }

};

useEffect(() => {

  const getProducts = async () => {

    try {

      const result = await axios.get(
        `/api/admin/get-shop-products/${shop._id}`
      );

      setProducts(result.data);

    } catch (error) {
      console.log(error);
    }

  };

  getProducts();

}, [shop._id]);

  return (
    <div className="min-h-screen bg-gray-100 p-10">

      <div className="max-w-7xl mx-auto">

        <div className="bg-white rounded-3xl shadow-xl p-8">

  <div className="grid lg:grid-cols-2 gap-10">

    <Image
      src={shop.shopImage}
      alt={shop.shopName}
      width={600}
      height={400}
      className="rounded-3xl w-full h-96 object-cover"
    />

    <div className="flex flex-col justify-center">

      <h1 className="text-5xl font-black">
        {shop.shopName}
      </h1>

      <p className="text-xl text-gray-500 mt-3">
        {shop.category}
      </p>

      <div className="mt-6 flex gap-3">

        <span className="bg-green-100 text-green-700 px-4 py-2 rounded-full">
          {shop.status}
        </span>

        <span className="bg-blue-100 text-blue-700 px-4 py-2 rounded-full">
          ⭐ {shop.rating}
        </span>

      </div>

    </div>

  </div>

</div>

<div className="bg-white rounded-3xl shadow-xl p-8 mt-8">

  <h2 className="text-3xl font-bold mb-6">
    Owner Information
  </h2>

  <div className="grid md:grid-cols-2 gap-6">

    <div>
      <p className="text-gray-500">Owner Name</p>
      <p className="text-xl font-semibold">
        {shop.ownerName}
      </p>
    </div>

    <div>
      <p className="text-gray-500">Email</p>
      <p className="text-xl font-semibold">
        {shop.email}
      </p>
    </div>

    <div>
      <p className="text-gray-500">Phone</p>
      <p className="text-xl font-semibold">
        {shop.mobile}
      </p>
    </div>

  </div>

</div>

    <div className="bg-white rounded-3xl shadow-xl p-8 mt-8">

  <h2 className="text-3xl font-bold mb-6">
    Shop Information
  </h2>

  <div className="grid md:grid-cols-2 xl:grid-cols-4 gap-8">

    <div>
      <p className="text-gray-500">
        Category
      </p>

      <p className="text-xl font-semibold">
        {shop.category}
      </p>
    </div>

    <div>
      <p className="text-gray-500">
        Delivery Radius
      </p>

      <p className="text-xl font-semibold">
        {shop.deliveryRadius} m
      </p>
    </div>

    <div>
      <p className="text-gray-500">
        Opening Time
      </p>

      <p className="text-xl font-semibold">
        {shop.openingTime}
      </p>
    </div>

    <div>
      <p className="text-gray-500">
        Closing Time
      </p>

      <p className="text-xl font-semibold">
        {shop.closingTime}
      </p>
    </div>

  </div>

  <div className="mt-8">

    <p className="text-gray-500 mb-2">
      Shop Address
    </p>

    <p className="text-xl font-semibold">
      {shop.address}
    </p>

  </div>

</div>

    <div className="bg-white rounded-3xl shadow-xl p-8 mt-8">

  <h2 className="text-3xl font-bold mb-8">
    Status Overview
  </h2>

  <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">

    <div className="rounded-2xl bg-green-50 p-6 border border-green-100">
      <p className="text-gray-500">Status</p>
      <h3 className="text-2xl font-bold text-green-700 mt-2">
        {shop.status}
      </h3>
    </div>

    <div className="rounded-2xl bg-blue-50 p-6 border border-blue-100">
      <p className="text-gray-500">Active</p>
      <h3 className="text-2xl font-bold text-blue-700 mt-2">
        {shop.isActive ? "Yes" : "No"}
      </h3>
    </div>

    <div className="rounded-2xl bg-purple-50 p-6 border border-purple-100">
      <p className="text-gray-500">Open</p>
      <h3 className="text-2xl font-bold text-purple-700 mt-2">
        {shop.isOpen ? "Open" : "Closed"}
      </h3>
    </div>

    <div className="rounded-2xl bg-yellow-50 p-6 border border-yellow-100">
      <p className="text-gray-500">Rating</p>
      <h3 className="text-2xl font-bold text-yellow-700 mt-2">
        ⭐ {shop.rating.toFixed(1)}
      </h3>
    </div>

  </div>

</div>

    <div className="bg-white rounded-3xl shadow-xl p-8 mt-8">

  <h2 className="text-3xl font-bold mb-8">
    Shop Actions
  </h2>

  <div className="grid md:grid-cols-3 gap-6">

    <button
      onClick={approveShop}
      disabled={shop.status === "approved"}
      className="
group
py-4
rounded-2xl
bg-green-600
hover:bg-green-700
hover:shadow-xl
hover:shadow-green-500/30
hover:-translate-y-1
active:scale-95
transition-all
duration-300
text-white
text-lg
font-bold
disabled:opacity-40
disabled:hover:translate-y-0
disabled:hover:shadow-none"
    >
      ✅ Approve Shop
    </button>

    <button
      onClick={rejectShop}
      className="
group
py-4
rounded-2xl
bg-red-600
hover:bg-red-700
hover:shadow-xl
hover:shadow-red-500/30
hover:-translate-y-1
active:scale-95
transition-all
duration-300
text-white
text-lg
font-bold"
    >
      ❌ Reject Shop
    </button>

    <button
      onClick={suspendShop}
      className="
group
py-4
rounded-2xl
bg-orange-500
hover:bg-orange-600
hover:shadow-xl
hover:shadow-orange-500/30
hover:-translate-y-1
active:scale-95
transition-all
duration-300
text-white
text-lg
font-bold"
    >
      🚫 Suspend Shop
    </button>

  </div>

</div>

    <div className="bg-white rounded-3xl shadow-xl p-8 mt-8">

  <h2 className="text-3xl font-bold mb-8">
    Products in this Shop
  </h2>

  <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6">

    {products.map((product: any) => (

      <div
        key={product._id}
        className="border rounded-2xl p-5 hover:shadow-lg transition"
      >

        <Image
          src={product.image}
          alt={product.name}
          width={300}
          height={220}
          className="rounded-xl w-full h-48 object-cover"
        />

        <h3 className="text-xl font-bold mt-4">
          {product.name}
        </h3>

        <p className="text-gray-500">
          {product.category}
        </p>

       <div className="flex justify-between mt-4">

<div>

<p className="font-bold text-green-600">

₹{product.price}

</p>

<p className="text-gray-500 text-sm">

Stock :
{product.stock}

</p>

</div>

<span
className={`

px-3
py-1
rounded-full
text-xs
font-semibold
h-fit

${
product.isAvailable
?
"bg-green-100 text-green-700"
:
"bg-red-100 text-red-700"
}

`}
>

{
product.isAvailable
?
"Available"
:
"Out of Stock"
}

</span>

</div>

        <div className="flex gap-3 mt-5">

 <button
  onClick={() => {
    setSelectedProduct(product);
    setShowEditModal(true);
  }}
  className="
  flex-1
  bg-blue-600
  hover:bg-blue-700
  text-white
  py-2
  rounded-xl
  font-semibold"
>
  ✏ Edit
</button>

<button

onClick={()=>

toggleAvailability(
product._id
)

}

className={`

flex-1
py-2
rounded-xl
font-semibold

${

product.isAvailable

?

"bg-yellow-500 hover:bg-yellow-600"

:

"bg-green-600 hover:bg-green-700"

}

text-white

`}

>

{

product.isAvailable

?

"Disable"

:

"Enable"

}

</button>

  <button
    onClick={() => deleteProduct(product._id)}
    className="
    flex-1
    bg-red-600
    hover:bg-red-700
    text-white
    py-2
    rounded-xl
    font-semibold"
  >
    🗑 Delete
  </button>

</div>

      </div>

    ))}

  </div>

</div>

      </div>

{showEditModal && selectedProduct && (

<div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50">

  <div className="bg-white rounded-3xl p-8 w-full
max-w-lg">

    <h2 className="text-3xl font-bold mb-6">
      Edit Product
    </h2>

    <input
      value={selectedProduct.name}
      onChange={(e)=>
        setSelectedProduct({
          ...selectedProduct,
          name:e.target.value
        })
      }
      className="w-full border rounded-xl p-3 mb-4"
    />

    <select
value={selectedProduct.category}
onChange={(e)=>
setSelectedProduct({
...selectedProduct,
category:e.target.value
})
}
className="w-full border rounded-xl p-3 mb-4"
>

<option>Fruits & Vegetables</option>
<option>Dairy & Eggs</option>
<option>Rice, Atta & Grains</option>
<option>Snacks & Biscuits</option>
<option>Spices & Masalas</option>
<option>Beverages & Drinks</option>
<option>Personal Care</option>
<option>Household Essentials</option>
<option>Instant & Packaged Food</option>
<option>Baby & Pet Care</option>

</select>

<select
value={selectedProduct.unit}
onChange={(e)=>
setSelectedProduct({
...selectedProduct,
unit:e.target.value
})
}
className="w-full border rounded-xl p-3 mb-4"
>

<option>kg</option>
<option>g</option>
<option>litre</option>
<option>ml</option>
<option>pieces</option>
<option>pack</option>
<option>dozen</option>
<option>bottle</option>
<option>box</option>
<option>can</option>
<option>bag</option>
<option>jar</option>
<option>tube</option>
<option>other</option>

</select>

    <input
      type="number"
      value={selectedProduct.price}
      onChange={(e)=>
        setSelectedProduct({
          ...selectedProduct,
          price:e.target.value
        })
      }
      className="w-full border rounded-xl p-3 mb-4"
    />

    <input
      type="number"
      value={selectedProduct.stock}
      onChange={(e)=>
        setSelectedProduct({
          ...selectedProduct,
          stock:e.target.value
        })
      }
      className="w-full border rounded-xl p-3 mb-6"
    />

    <select
value={String(selectedProduct.isAvailable)}
onChange={(e)=>
setSelectedProduct({
...selectedProduct,
isAvailable:e.target.value==="true"
})
}
className="w-full border rounded-xl p-3 mb-6"
>

<option value="true">
Available
</option>

<option value="false">
Out of Stock
</option>

</select>

    <div className="flex justify-end gap-3">

      <button
        onClick={() => setShowEditModal(false)}
        className="px-5 py-2 rounded-xl bg-gray-300"
      >
        Cancel
      </button>

      <button
onClick={saveProduct}
className="
px-5
py-2
rounded-xl
bg-green-600
hover:bg-green-700
text-white
"
>
Save
</button>

    </div>

  </div>

</div>

)}

</div>
  );
}