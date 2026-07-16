"use client";

import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Store,
  Package,
  ShoppingCart,
  Truck,
  Users,
  BarChart3,
} from "lucide-react";

const menus = [
  {
    title: "Dashboard",
    href: "/admin",
    icon: LayoutDashboard,
  },
  {
    title: "Manage Shops",
    href: "/admin/manage-shop",
    icon: Store,
  },
  {
    title: "Products",
    href: "/admin/view-product",
    icon: Package,
  },
  {
    title: "Orders",
    href: "/admin/manage-orders",
    icon: ShoppingCart,
  },
  {
    title: "Delivery Boys",
    href: "/admin/delivery-boys",
    icon: Truck,
  },
  {
    title: "Customers",
    href: "/admin/customers",
    icon: Users,
  },
  {
    title: "Analytics",
    href: "/admin/analytics",
    icon: BarChart3,
  },
];

export default function AdminSidebar() {
  const pathname = usePathname();

  return (
    <aside className="fixed left-0 top-0 h-screen w-72 bg-white border-r shadow-xl">

      <div className="flex items-center gap-4 p-6 border-b">

  <Link
    href="/"
    className="
    w-11
    h-11
    rounded-xl
    bg-green-100
    hover:bg-green-200
    transition
    flex
    items-center
    justify-center"
  >
    <ArrowLeft className="w-5 h-5 text-green-700" />
  </Link>

  <h1 className="text-3xl font-black text-green-600">
    LoKart Admin
  </h1>

</div>

      <div className="p-4 space-y-2">

        {menus.map((menu) => {
          const Icon = menu.icon;

          return (
            <Link
              key={menu.href}
              href={menu.href}
              className={`flex items-center gap-4 rounded-xl px-4 py-3 transition
              ${
                pathname === menu.href
                  ? "bg-green-600 text-white"
                  : "hover:bg-green-100"
              }`}
            >
              <Icon size={22} />
              {menu.title}
            </Link>
          );
        })}

      </div>
    </aside>
  );
}