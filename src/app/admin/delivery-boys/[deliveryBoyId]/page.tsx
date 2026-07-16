import connectDb from "@/lib/db";
import User from "@/models/user.model";
import Order from "@/models/order.model";
import DeliveryBoyDetails from "@/components/DeliveryBoyDetails";
import { notFound } from "next/navigation";

interface Props {
  params: Promise<{
    deliveryBoyId: string;
  }>;
}

export default async function Page({ params }: Props) {
  const { deliveryBoyId } = await params;

  await connectDb();

  const deliveryBoy = await User.findById(deliveryBoyId).lean();

  if (!deliveryBoy) {
    return notFound();
  }

  const assignedOrders = await Order.find({
    assignedDeliveryBoy: deliveryBoyId,
  }).lean();

 return (
  <DeliveryBoyDetails
    deliveryBoyId={deliveryBoyId}
  />
);
}