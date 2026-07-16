import ShopOrderDetails from "@/components/ShopOrderDetails";

interface Props {
  params: Promise<{
    orderId: string;
  }>;
}

export default async function Page({ params }: Props) {
  const { orderId } = await params;

  return <ShopOrderDetails orderId={orderId} />;
}