import { auth } from '@/auth'
import AdminDashboard from '@/components/AdminDashboard'
import DeliveryBoy from '@/components/DeliveryBoy'
import EditRoleMobile from '@/components/EditRoleMobile'
import GeoUpdater from '@/components/GeoUpdater'
import Nav from '@/components/Nav'
import UserDashboard from '@/components/UserDashboard'
import connectDb from '@/lib/db'
import Grocery, { IGrocery } from '@/models/grocery.model'
import User from '@/models/user.model'
import Shop, { IShop } from "@/models/shop.model";
import { redirect } from 'next/navigation'
import ShopOwnerDashboard from "@/components/ShopOwnerDashboard";



async function Home(props:{
  searchParams: Promise<{
    q?: string
    category?: string
}>
}) {

  const searchParams=await props.searchParams
 
  await connectDb()
  const session = await auth()

  if (!session?.user?.email) {
    redirect("/login")
  }

  const user = await User.findOne({ email: session.user.email })

  

  if (!user) {
    redirect("/login")
  }

  const incomplete =
  !user.mobile ||
  !user.role ||
  (user.role === "user" && !user.mobile);

  if (incomplete) {
    return <EditRoleMobile />
  }
  const plainuser=JSON.parse(JSON.stringify(user))

  let shop = null;

if (user.role === "shopowner") {
  shop = await Shop.findOne({
    ownerId: user._id,
  });

  if (!shop) {
    redirect("/shop/register");
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

 let shopList: IShop[] = [];

  if (user.role === "user") {

  const query: any = {
    status: "approved",
    isActive: true,
  };

  if (searchParams.q) {
    query.shopName = {
      $regex: searchParams.q,
      $options: "i",
    };
  }

  if (searchParams.category) {
    query.category = searchParams.category;
  }

  shopList = await Shop.find(query).sort({
    createdAt: -1,
  });

}
  return (
    <>
      <Nav user={plainuser}/>
      <GeoUpdater userId={plainuser._id.toString()}/>
      {
user.role === "user" ? (

    <UserDashboard shopList={JSON.parse(JSON.stringify(shopList))} />

) : user.role === "superadmin" ? (

    <AdminDashboard/>

) : user.role === "shopowner" ? (

    <ShopOwnerDashboard />

) : (

    <DeliveryBoy/>

)
}
    </>
  )
}

export default Home;