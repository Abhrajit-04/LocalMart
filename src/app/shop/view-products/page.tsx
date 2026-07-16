"use client";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import {
  ArrowLeft,
  Loader,
  Package,
  Pencil,
  Search,
  Upload,
  X,
  CircleDollarSign,
  Boxes,
  BadgeCheck,
  PackageX,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { IGrocery } from "@/models/grocery.model";
import Image from "next/image";

const categories = [
  "Fruits & Vegetables",
  "Dairy & Eggs",
  "Rice, Atta & Grains",
  "Snacks & Biscuits",
  "Spices & Masalas",
  "Beverages & Drinks",
  "Personal Care",
  "Household Essentials",
  "Instant & Packaged Food",
  "Baby & Pet Care",
];

const units = [
  "kg",
  "g",
  "litre",
  "ml",
  "pieces",
  "pack",
  "dozen",
  "bottle",
  "box",
  "can",
  "bag",
  "jar",
  "tube",
  "other",
];

function ViewGrocery() {
  const router = useRouter();
  const [groceries, setGroceries] = useState<IGrocery[]>();
  const [search, setSearch] = useState("");
  const [editing, setEditing] = useState<IGrocery | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [backendImage, setBackendImage] = useState<Blob | null>(null);
  const [loading, setLoading] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [filltered, setFilltered] = useState<IGrocery[]>();

  const totalProducts = groceries?.length || 0;

  const availableProducts = groceries?.filter((g) => g.isAvailable).length || 0;

  const outOfStockProducts =
    groceries?.filter((g) => g.stock === 0).length || 0;

  const inventoryValue =
    groceries?.reduce((total, g) => total + g.price * g.stock, 0) || 0;

  const fetchGroceries = async () => {
    try {
      const result = await axios.get("/api/admin/get.grocery");

      setGroceries(result.data);

      setFilltered(result.data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchGroceries();
  }, []);

  useEffect(() => {
    if (editing) {
      setImagePreview(editing.image);
    }
  }, [editing]);

  useEffect(() => {
    if (!groceries) return;

    const q = search.trim().toLowerCase();

    if (!q) {
      setFilltered(groceries);
      return;
    }

    const nameResults = groceries.filter((g) =>
      g.name.toLowerCase().includes(q),
    );

    if (nameResults.length > 0) {
      setFilltered(nameResults);
      return;
    }

    const categoryResults = groceries.filter((g) =>
      g.category.toLowerCase().includes(q),
    );

    setFilltered(categoryResults);
  }, [search, groceries]);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setBackendImage(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };
const handleEdit = async () => {

  if (!editing) return;

  setLoading(true);

  try {
      const formData = new FormData();
      formData.append("groceryId", editing?._id?.toString()!);
      formData.append("name", editing?.name ?? "");
      formData.append("category", editing?.category ?? "");
      formData.append("price", editing?.price?.toString() ?? "");
      formData.append("unit", editing?.unit ?? "");

      formData.append("stock", editing.stock.toString());

      formData.append("isAvailable", editing.isAvailable.toString());

      if (backendImage) {
        formData.append("image", backendImage);
      }
      const result = await axios.post("/api/admin/edit-grocery", formData);

      await fetchGroceries();

      setLoading(false);

      setEditing(null);

      setBackendImage(null);

      setImagePreview(null);
    } catch (error) {
      console.log(error);
    }
  };

  const handleDelete = async () => {
    setDeleteLoading(true);
    if (!editing) return;
    try {
      const result = await axios.post("/api/admin/delete-grocery", {
        groceryId: editing._id,
      });

      await fetchGroceries();

      setDeleteLoading(false);

      setEditing(null);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="pt-14 max-w-7xl mx-auto px-4 md:px-6 pb-24">
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.4 }}
        className="mb-12"
      >
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <button
            onClick={() => router.push("/")}
            className="
flex items-center gap-2
px-4 py-3
bg-white
rounded-2xl
shadow-md
hover:shadow-xl
transition-all
w-fit self-start md:self-auto"
          >
            <ArrowLeft size={18} />
            <span className="font-medium">Back</span>
          </button>

          <div className="flex flex-col items-center">
            <div className="flex items-center justify-center gap-3">
              <Package className="w-8 h-8 text-green-600" />
              <h1
                className="
text-3xl
sm:text-4xl
font-bold
text-green-700
leading-tight
text-center"
              >
                My Products
              </h1>
            </div>

            <p
              className="
text-sm
text-gray-400
mt-2
text-center
max-w-xs"
            >
              Manage your shop inventory
            </p>
          </div>
        </div>
      </motion.div>

      <motion.form
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="
mt-8
mb-12
w-full
max-w-xl
mx-auto
bg-white
rounded-3xl
shadow-xl
border border-gray-100
px-5
py-4
flex items-center
focus-within:ring-4
focus-within:ring-green-300
transition-all"
      >
        <Search className="w-6 h-6 text-green-600 mr-4" />
        <input
          type="text"
          className="
w-full
bg-transparent
outline-none
text-lg
text-gray-700
placeholder:text-gray-400"
          placeholder="Search by name or category..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </motion.form>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-14">
        <motion.div
          whileHover={{ y: -6, scale: 1.03 }}
          className="bg-white/70 backdrop-blur-xl rounded-3xl p-6 shadow-xl border border-white/40"
        >
          <Boxes className="w-8 h-8 text-green-600 mb-4" />

          <p className="text-gray-500">Products</p>

          <h2 className="text-4xl font-bold mt-2">{totalProducts}</h2>
        </motion.div>

        <motion.div
          whileHover={{ y: -6, scale: 1.03 }}
          className="bg-white/70 backdrop-blur-xl rounded-3xl p-6 shadow-xl border border-white/40"
        >
          <BadgeCheck className="w-8 h-8 text-emerald-600 mb-4" />

          <p className="text-gray-500">Available</p>

          <h2 className="text-4xl font-bold mt-2 text-green-600">
            {availableProducts}
          </h2>
        </motion.div>

        <motion.div
          whileHover={{ y: -6, scale: 1.03 }}
          className="bg-white/70 backdrop-blur-xl rounded-3xl p-6 shadow-xl border border-white/40"
        >
          <PackageX className="w-8 h-8 text-red-500 mb-4" />

          <p className="text-gray-500">Out of Stock</p>

          <h2 className="text-4xl font-bold mt-2 text-red-500">
            {outOfStockProducts}
          </h2>
        </motion.div>

        <motion.div
          whileHover={{ y: -6, scale: 1.03 }}
          className="bg-white/70 backdrop-blur-xl rounded-3xl p-6 shadow-xl border border-white/40"
        >
          <CircleDollarSign className="w-8 h-8 text-yellow-500 mb-4" />

          <p className="text-gray-500">Inventory Value</p>

          <h2 className="text-3xl font-bold mt-2">₹{inventoryValue}</h2>
        </motion.div>
      </div>

      <div className="space-y-6 mt-14">
        {filltered?.length === 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col items-center justify-center py-24"
          >
            <Package className="w-20 h-20 text-gray-300" />

            <h2 className="mt-5 text-2xl font-bold text-gray-700">
              No Products Found
            </h2>

            <p className="mt-2 text-gray-500">
              We couldn't find any product matching
              <span className="font-semibold text-green-600"> "{search}"</span>.
            </p>
          </motion.div>
        )}

        {filltered?.map((g, i) => (
          <motion.div
            key={i}
            whileHover={{ scale: 1.01 }}
            transition={{ type: "spring", stiffness: 100 }}
            className="
group
bg-white
rounded-[30px]
shadow-lg
hover:shadow-2xl
transition-all
flex flex-col md:flex-row
items-center md:items-start
gap-6
p-5 md:p-7"
          >
            <div
              className="
relative
w-32 h-32 sm:w-40 sm:h-40
rounded-3xl
overflow-hidden
bg-gradient-to-br from-gray-50 to-gray-100
border border-gray-100
shadow-md"
            >
              <Image
                src={g.image}
                alt={g.name}
                fill
                className="object-cover group-hover:scale-110 duration-500"
              />
            </div>

            <div className="flex-1 flex flex-col justify-between w-full">
              <div>
                <h3 className="text-xl font-bold text-gray-800">{g.name}</h3>

                <p className="text-sm text-gray-500 mt-1">{g.category}</p>

                <div className="flex flex-wrap gap-2 mt-4">
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-semibold ${
                      g.isAvailable
                        ? "bg-green-100 text-green-700"
                        : "bg-red-100 text-red-700"
                    }`}
                  >
                    {g.isAvailable ? "Available" : "Unavailable"}
                  </span>

                  <span className="px-3 py-1 rounded-full bg-gray-100 text-gray-700 text-xs">
                    Stock : {g.stock} {g.unit}
                  </span>
                </div>
              </div>

              <div
                className="
mt-5
flex
flex-col
md:flex-row
md:items-center
md:justify-between
gap-4"
              >
                <p className="text-2xl font-bold text-green-600">
                  ₹{g.price}/
                  <span className="text-gray-400 text-sm ml-1">{g.unit}</span>
                </p>

                <p className="text-sm text-gray-400 mt-2">
                  Added on{" "}
                  {g.createdAt
                    ? new Date(g.createdAt).toLocaleDateString()
                    : "-"}
                </p>

                <button
                  className="
px-6 py-3
rounded-2xl
bg-gradient-to-r from-green-600 to-emerald-500
text-white
font-semibold
shadow-xl
hover:scale-105
hover:shadow-2xl
transition-all
flex items-center gap-2
w-full md:w-auto justify-center"
                  onClick={() => setEditing(g)}
                >
                  <Pencil size={15} /> Edit
                </button>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      <AnimatePresence>
        {editing && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-md flex items-center justify-center z-50 p-4"
          >
            <motion.div
              initial={{ y: 40, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 40, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="bg-white rounded-3xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto p-8 relative"
            >
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-bold text-green-700">
                  Edit Product
                </h2>
                <button
                  className="text-gray-600 hover:text-red-600"
                  onClick={() => setEditing(null)}
                >
                  <X size={18} />
                </button>
              </div>
              <div
                className="
relative
h-64
rounded-3xl
overflow-hidden
border border-gray-100
shadow-md
mb-6
group
cursor-pointer"
              >
                {imagePreview && (
                  <Image
                    src={imagePreview}
                    alt={editing.name}
                    fill
                    className="object-cover group-hover:scale-105 transition-all duration-300"
                  />
                )}
                <label
                  htmlFor="imageUpload"
                  className="
absolute inset-0
bg-black/40
backdrop-blur-[2px]
opacity-0
group-hover:opacity-100
flex items-center justify-center
cursor-pointer
transition-all duration-300
rounded-3xl"
                >
                  <div className="bg-white/20 p-4 rounded-full">
                    <Upload className="w-8 h-8 text-white" />
                  </div>
                </label>
                <input
                  type="file"
                  accept="image/*"
                  hidden
                  id="imageUpload"
                  onChange={handleImageUpload}
                />
              </div>
              <div className="space-y-4">
                <input
                  type="text"
                  placeholder="Enter Product Name"
                  value={editing.name}
                  onChange={(e) =>
                    setEditing({ ...editing, name: e.target.value })
                  }
                  className="w-full px-4 py-4 rounded-2xl border border-gray-200 bg-gray-50 focus:ring-2 focus:ring-green-500 outline-none transition"
                />

                

                <select
                  className="w-full border border-gray-300 rounded-lg p-2.5 focus:ring-2 focus:ring-green-500 outline-none bg-white"
                  value={editing.category}
                  onChange={(e) =>
                    setEditing({ ...editing, category: e.target.value })
                  }
                >
                  <option>Select Category</option>
                  {categories.map((c, i) => (
                    <option key={i} value={c}>
                      {c}
                    </option>
                  ))}
                </select>

                <input
                  type="text"
                  placeholder="Price"
                  value={editing.price}
                  onChange={(e) =>
                    setEditing({ ...editing, price: Number(e.target.value) })
                  }
                  className="w-full px-4 py-4 rounded-2xl border border-gray-200 bg-gray-50 focus:ring-2 focus:ring-green-500 outline-none transition"
                />

                <div>
                  <label className="block mb-2 font-medium">Stock</label>

                  <input
                    type="number"
                    value={editing.stock}
                    onChange={(e) =>
                      setEditing({
                        ...editing,
                        stock: Number(e.target.value),
                      })
                    }
                    className="w-full px-4 py-4 rounded-2xl border border-gray-200 bg-gray-50 focus:ring-2 focus:ring-green-500 outline-none"
                  />
                </div>

                <select
                  className="w-full border border-gray-300 rounded-lg p-2.5 focous:ring-2 focous:ring-green-500 outline-none bg-white"
                  value={editing.unit}
                  onChange={(e) =>
                    setEditing({ ...editing, unit: e.target.value })
                  }
                >
                  <option>Select Category</option>
                  {units.map((u, i) => (
                    <option key={i} value={u}>
                      {u}
                    </option>
                  ))}
                </select>

                <div className="flex items-center justify-between rounded-2xl border border-gray-200 bg-gray-50 px-4 py-4">
                  <div>
                    <p className="font-semibold text-gray-700">
                      Product Availability
                    </p>

                    <p className="text-sm text-gray-500">
                      Customers can only buy available products.
                    </p>
                  </div>

                  <label className="relative inline-flex cursor-pointer items-center">
                    <input
                      type="checkbox"
                      checked={editing.isAvailable}
                      onChange={(e) =>
                        setEditing({
                          ...editing,
                          isAvailable: e.target.checked,
                        })
                      }
                      className="peer sr-only"
                    />

                    <div
                      className="
      h-7
      w-12
      rounded-full
      bg-gray-300
      transition-all
      peer-checked:bg-green-500
      after:absolute
      after:left-1
      after:top-1
      after:h-5
      after:w-5
      after:rounded-full
      after:bg-white
      after:transition-all
      peer-checked:after:translate-x-5"
                    />
                  </label>
                </div>
              </div>
              <div className="flex justify-end gap-3 mt-6">
                <button
                  className="px-4 py-2 rounded-lg bg-green-600 text-white flex items-center gap-2 hover:bg-green-700 transition-all"
                  onClick={handleEdit}
                  disabled={loading}
                >
                  {loading ? <Loader size={14} /> : "Edit Grocery"}
                </button>
                <button
                  className="px-4 py-2 rounded-lg bg-red-600 text-white flex items-center gap-2 hover:bg-red-700 transition"
                  onClick={handleDelete}
                  disabled={deleteLoading}
                >
                  {deleteLoading ? <Loader size={14} /> : "Delete Grocery"}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default ViewGrocery;
