"use client";

import { useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import {
  Store,
  User,
  Mail,
  Lock,
  Phone,
  MapPin,
  Clock3,
  ImageIcon,
  ShieldCheck,
  Navigation,
  Tag,
  StoreIcon,
} from "lucide-react";

export default function ShopRegisterForm() {
  const [formData, setFormData] = useState({
    ownerName: "",
    email: "",
    password: "",
    mobile: "",

    shopName: "",
    category: "",
    openingTime: "",
    closingTime: "",

    address: "",

    latitude: "",
    longitude: "",

    deliveryRadius: "5",
  });

  const [shopLogo, setShopLogo] = useState<File | null>(null);

  const [logoPreview, setLogoPreview] = useState("");

  const [loading, setLoading] = useState(false);

const [agree, setAgree] = useState(false);

const router = useRouter();

  const detectLocation = () => {
    if (!navigator.geolocation) {
      alert("Geolocation is not supported by your browser.");
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setFormData((prev) => ({
          ...prev,
          latitude: position.coords.latitude.toString(),
          longitude: position.coords.longitude.toString(),
        }));
      },

      (error) => {
        alert("Unable to fetch your location.");

        console.log(error);
      },
    );
  };

 const handleRegisterShop = async () => {

if (
  !formData.shopName ||
  !formData.category ||
  !formData.address ||
  !formData.latitude ||
  !formData.longitude
) {
  alert("Please fill all required fields.");
  return;
}

if (!shopLogo) {
  alert("Please upload your shop logo.");
  return;
}

if (!agree) {
  alert("Please accept Terms & Conditions.");
  return;
}

setLoading(true);

  try {
    const data = new FormData();

    data.append("shopName", formData.shopName);
    data.append("category", formData.category);
    data.append("address", formData.address);
    data.append("latitude", formData.latitude);
    data.append("longitude", formData.longitude);
    data.append("deliveryRadius", formData.deliveryRadius);
    data.append("openingTime", formData.openingTime);
    data.append("closingTime", formData.closingTime);

    if (shopLogo) {
      data.append("shopImage", shopLogo);
    }

    const response = await axios.post(
      "/api/shop/register",
      data
    );

    router.push("/shop/pending");

    setFormData({
  ownerName: "",
  email: "",
  password: "",
  mobile: "",

  shopName: "",
  category: "",
  openingTime: "",
  closingTime: "",

  address: "",

  latitude: "",
  longitude: "",

  deliveryRadius: "5",
});

setShopLogo(null);

setLogoPreview("");

setAgree(false);

    console.log(response.data);

  } catch (error: any) {

    console.log(error.response?.data);

    alert(error.response?.data?.message);

}
finally{

    setLoading(false);

}
};

  const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];

    if (!file) return;

    setShopLogo(file);

    setLogoPreview(URL.createObjectURL(file));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-100 via-white to-emerald-100 py-12 px-6">
      <div className="max-w-5xl mx-auto bg-white/90 backdrop-blur-xl rounded-[35px] border border-white shadow-xl p-12">
        <div className="flex flex-col items-center">
          <div className="w-24 h-24 rounded-full bg-emerald-100 flex items-center justify-center shadow-lg">
            <Store className="w-12 h-12 text-emerald-600" />
          </div>

          <h1 className="text-5xl font-extrabold mt-6 text-gray-900">
            Register Your Shop
          </h1>

          <p className="text-gray-500 mt-3 text-lg">
            Become a verified LocalMart Partner
          </p>

          <div className="flex gap-6 mt-6 text-sm">
            <div className="flex items-center gap-2 text-emerald-600">
              <ShieldCheck size={18} />
              Verified Seller
            </div>

            <div className="flex items-center gap-2 text-emerald-600">
              <Navigation size={18} />
              Fast Approval
            </div>
          </div>
        </div>

        {/* Owner Details */}

        <div className="mt-10 rounded-2xl bg-gray-50 border border-gray-200 p-5">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center">
              <User className="text-emerald-600" />
            </div>

            <h2 className="text-2xl font-bold">Owner Details</h2>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <label className="flex items-center gap-2 mb-2 font-semibold">
                <User size={18} />
                Owner Name
              </label>

              <input
                type="text"
                placeholder="Enter owner name"
                value={formData.ownerName}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    ownerName: e.target.value,
                  })
                }
                className="w-full rounded-2xl border border-gray-200 bg-gray-50 px-4 py-3 outline-none transition-all duration-300 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100"
              />
            </div>

            <div>
              <label className="flex items-center gap-2 mb-2 font-semibold">
                <Mail size={18} />
                Email
              </label>

              <input
                type="email"
                placeholder="Enter email"
                value={formData.email}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    email: e.target.value,
                  })
                }
                className="w-full rounded-2xl border border-gray-200 bg-gray-50 px-4 py-3 outline-none transition-all duration-300 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100"
              />
            </div>

            <div>
              <label className="flex items-center gap-2 mb-2 font-semibold">
                <Lock size={18} />
                Password
              </label>

              <input
                type="password"
                placeholder="Create password"
                value={formData.password}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    password: e.target.value,
                  })
                }
                className="w-full rounded-2xl border border-gray-200 bg-gray-50 px-4 py-3 outline-none transition-all duration-300 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100"
              />
            </div>

            <div>
              <label className="flex items-center gap-2 mb-2 font-semibold">
                <Phone size={18} />
                Mobile Number
              </label>

              <input
                type="text"
                placeholder="Enter mobile number"
                value={formData.mobile}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    mobile: e.target.value,
                  })
                }
                className="w-full rounded-2xl border border-gray-200 bg-gray-50 px-4 py-3 outline-none transition-all duration-300 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100"
              />
            </div>
          </div>
        </div>

        {/* Shop Details */}

        <div className="mt-10 rounded-2xl bg-gray-50 border border-gray-200 p-5">
          <h2 className="text-2xl font-semibold text-gray-800 mb-6">
            Shop Details
          </h2>

          <div className="grid md:grid-cols-2 gap-6">
            {/* Shop Name */}

            <div>
              <label className="flex items-center gap-2 mb-2 font-semibold">
                <Store size={18} />
                Shop Name
              </label>

              <input
                type="text"
                placeholder="ABC Grocery"
                value={formData.shopName}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    shopName: e.target.value,
                  })
                }
                className="w-full rounded-2xl border border-gray-200 bg-gray-50 px-4 py-3 outline-none transition-all duration-300 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100"
              />
            </div>

            {/* Category */}

            <div>
              <label className="flex items-center gap-2 mb-2 font-semibold">
                <Tag size={18} />
                Shop Category
              </label>

              <select
                value={formData.category}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    category: e.target.value,
                  })
                }
                className="w-full rounded-2xl border border-gray-200 bg-gray-50 px-4 py-3 outline-none transition-all duration-300 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100"
              >
                <option value="">Select Shop Category</option>
                <option value="Grocery Store">Grocery Store</option>
                <option value="Supermarket">Supermarket</option>
                <option value="Fruit & Vegetable Store">
                  Fruit & Vegetable Store
                </option>
                <option value="Dairy Store">Dairy Store</option>
                <option value="Bakery">Bakery</option>
                <option value="Pharmacy">Pharmacy</option>
                <option value="Pet Store">Pet Store</option>
                <option value="Meat & Fish">Meat & Fish</option>
                <option value="Organic Store">Organic Store</option>
              </select>
            </div>

            {/* Opening Time */}

            <div>
              <label className="flex items-center gap-2 mb-2 font-semibold">
                <Clock3 size={18} />
                Opening Time
              </label>

              <input
                type="time"
                value={formData.openingTime}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    openingTime: e.target.value,
                  })
                }
                className="w-full rounded-2xl border border-gray-200 bg-gray-50 px-4 py-3 outline-none transition-all duration-300 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100"
              />
            </div>

            {/* Closing Time */}

            <div>
              <label className="flex items-center gap-2 mb-2 font-semibold">
                <Clock3 size={18} />
                Closing Time
              </label>
              <input
                type="time"
                value={formData.closingTime}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    closingTime: e.target.value,
                  })
                }
                className="w-full rounded-2xl border border-gray-200 bg-gray-50 px-4 py-3 outline-none transition-all duration-300 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100"
              />
            </div>
          </div>
        </div>

        {/* Shop Location */}

        <div className="mt-10 rounded-2xl bg-gray-50 border border-gray-200 p-5">
          <h2 className="text-2xl font-semibold text-gray-800 mb-6">
            Shop Location
          </h2>

          <div className="grid md:grid-cols-2 gap-6">
            {/* Shop Address */}

            <div className="md:col-span-2">
              <label className="flex items-center gap-2 mb-2 font-semibold">
                <MapPin size={18} />
                Shop Address
              </label>

              <textarea
                rows={3}
                placeholder="Enter complete shop address"
                value={formData.address}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    address: e.target.value,
                  })
                }
                className="w-full rounded-2xl border border-gray-200 bg-gray-50 px-4 py-3 outline-none transition-all duration-300 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100"
              />
            </div>

            {/* Latitude */}

            <div>
              <label className="flex items-center gap-2 mb-2 font-semibold">
                Latitude
              </label>

              <input
                type="text"
                value={formData.latitude}
                readOnly
                placeholder="Auto Detect"
                className="w-full rounded-2xl border border-gray-200 bg-gray-50 px-4 py-3 outline-none transition-all duration-300"
              />
            </div>

            {/* Longitude */}

            <div>
              <label className="flex items-center gap-2 mb-2 font-semibold">
                Longitude
              </label>

              <input
                type="text"
                value={formData.longitude}
                readOnly
                placeholder="Auto Detect"
                className="w-full rounded-2xl border border-gray-200 bg-gray-50 px-4 py-3 outline-none transition-all duration-300"
              />
            </div>

            {/* Delivery Radius */}

            <div>
              <label className="block mb-2 font-medium">Delivery Radius</label>

              <select
                value={formData.deliveryRadius}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    deliveryRadius: e.target.value,
                  })
                }
                className="w-full rounded-2xl border border-gray-200 bg-gray-50 px-4 py-3 outline-none transition-all duration-300 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100"
              >
                <option value="2">2 KM</option>
                <option value="3">3 KM</option>
                <option value="5">5 KM</option>
                <option value="8">8 KM</option>
              </select>
            </div>

            <div className="md:col-span-2 flex justify-center mt-4">
              <button
                type="button"
                onClick={detectLocation}
                className="
flex
items-center
gap-2
px-8
py-4
rounded-2xl
bg-gradient-to-r
from-emerald-500
to-green-600
text-white
font-bold
shadow-lg
hover:scale-105
hover:shadow-xl
transition-all
duration-300
"
              >
                📍 Detect My Shop Location
              </button>
            </div>
          </div>

          {/* Shop Branding */}

          <div className="mt-12">
            <h2 className="text-2xl font-semibold text-gray-800 mb-6">
              Shop Branding
            </h2>

            <div className="grid md:grid-cols-2 gap-8">
              {/* Upload */}

              <div>
                <label className="flex items-center gap-2 mb-2 font-semibold">
                  <Store size={18} />
                  Shop Logo
                </label>

                <label
                  htmlFor="shopLogo"
                  className="border-2 border-dashed border-emerald-300 rounded-2xl h-56 flex flex-col justify-center items-center cursor-pointer hover:bg-emerald-50 transition-all duration-300 hover:border-emerald-500"
                >
                  <ImageIcon className="w-12 h-12 text-emerald-500" />

                  <p className="mt-4 font-semibold">Upload Shop Logo</p>

                  <p className="text-sm text-gray-500">PNG • JPG • WEBP</p>

                  <p className="text-xs text-gray-400 mt-2">
                    Recommended: 512 × 512 px
                  </p>

                  {shopLogo && (
                    <button
                      type="button"
                      onClick={() => {
                        setShopLogo(null);
                        setLogoPreview("");
                      }}
                      className="mt-3 text-sm text-red-500 hover:text-red-700"
                    >
                      Remove Logo
                    </button>
                  )}
                </label>

                <input
                  id="shopLogo"
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleLogoChange}
                />
              </div>

              {/* Preview */}

              <div>
                <label className="flex items-center gap-2 mb-2 font-semibold">
                  <ImageIcon size={18} />
                  Preview
                </label>

                <div className="h-56 rounded-2xl border-2 border-dashed border-gray-300 overflow-hidden flex items-center justify-center bg-gray-50">
                  {logoPreview ? (
                    <img
                      src={logoPreview}
                      alt="Shop Logo"
                      className="w-full h-full object-cover rounded-2xl"
                    />
                  ) : (
                    <div className="flex flex-col items-center">
                      <ImageIcon className="w-12 h-12 text-gray-300" />

                      <p className="mt-3 text-gray-500">Logo Preview</p>
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="mt-10">
              <label className="flex items-center gap-3">
                <input
type="checkbox"
checked={agree}
onChange={(e)=>setAgree(e.target.checked)}
className="w-5 h-5 accent-emerald-600 cursor-pointer"
/>

                <span>
                  I agree to the Terms & Conditions and Privacy Policy.
                </span>
              </label>
            </div>

            <div className="mt-12 flex justify-center">
              <button
type="button"
disabled={loading}
onClick={handleRegisterShop}
                className={`
w-full
py-4
rounded-2xl
bg-gradient-to-r
from-emerald-500
to-green-600
text-white
font-bold
text-lg
shadow-lg
transition-all
duration-300
${loading
? "opacity-60 cursor-not-allowed"
: "hover:scale-[1.02] hover:shadow-2xl"}
`}
              >
                <div className="flex items-center justify-center gap-2">
                  <Store size={20} />
                  <span>

{loading ? "Registering..." : "Register Shop"}

</span>
                </div>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
