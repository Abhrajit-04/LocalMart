import ShopRegisterForm from "@/components/ShopRegisterForm";
import { auth } from "@/auth";
import connectDb from "@/lib/db";
import Shop from "@/models/shop.model";
import { redirect } from "next/navigation";

export default async function ShopRegisterPage() {
  await connectDb();

  const session = await auth();

  if (!session?.user) {
    redirect("/login");
  }

  const shop = await Shop.findOne({
    ownerId: session.user.id,
  });

  if (shop) {
    if (shop.status === "approved") {
      redirect("/shop");
    }

    if (shop.status === "pending") {
      redirect("/shop/pending");
    }

    if (shop.status === "rejected") {
      redirect("/shop/rejected");
    }

    if (shop.status === "suspended") {
      redirect("/shop/suspended");
    }
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <ShopRegisterForm />
    </div>
  );
}