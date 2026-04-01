import { auth } from '@/auth'
import AdminDashboard from '@/components/AdminDashboard'
import DeliveryBoy from '@/components/DeliveryBoy'
import EditRoleMobile from '@/components/EditRoleMobile'
import Nav from '@/components/Nav'
import UserDashboard from '@/components/UserDashboard'
import connectDb from '@/lib/db'
import User from '@/models/user.model'
import { redirect } from 'next/navigation'
import React from 'react'
import { json } from 'stream/consumers'

async function Home() {
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
  
  return (
    <>
      <Nav user={plainuser}/>
      {user.role=="user"?(
        <UserDashboard/>
      ):user.role=="admin"?(
        <AdminDashboard/>
      ):<DeliveryBoy/>}
    </>
  )
}

export default Home;