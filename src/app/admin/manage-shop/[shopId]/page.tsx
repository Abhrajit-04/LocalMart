import connectDb from "@/lib/db";
import Shop from "@/models/shop.model";
import ShopDetails from "@/components/ShopDetails";
import { notFound } from "next/navigation";

interface Props {
  params: Promise<{
    shopId: string;
  }>;
}

export default async function Page({ params }: Props) {
  const { shopId } = await params;

  await connectDb();

  const shop = await Shop.findById(shopId).lean();

  if (!shop) {
    return notFound();
  }

  return (
    <ShopDetails
      shop={JSON.parse(JSON.stringify(shop))}
    />
  );
}