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
import { redirect } from 'next/navigation'



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

  const incomplete = !user.mobile || !user.role || (!user.mobile && user.role=="user")

  if (incomplete) {
    return <EditRoleMobile />
  }
  const plainuser=JSON.parse(JSON.stringify(user))

  let groceryList:IGrocery[]=[]

  if(user.role==="user"){
    if (searchParams.q) {

    groceryList = await Grocery.find({
        name: {
            $regex: searchParams.q,
            $options: "i"
        }
    })

}
else if (searchParams.category) {

    groceryList = await Grocery.find({
        category: searchParams.category
    })

}
else {

    groceryList = await Grocery.find({})

}
  }
  
  return (
    <>
      <Nav user={plainuser}/>
      <GeoUpdater userId={plainuser._id.toString()}/>
      {user.role=="user"?(
        <UserDashboard groceryList={groceryList}/>
      ):user.role=="admin"?(
        <AdminDashboard/>
      ):<DeliveryBoy/>}
    </>
  )
}

export default Home;