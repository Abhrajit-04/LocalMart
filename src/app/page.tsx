import { auth } from '@/auth'
import EditRoleMobile from '@/components/EditRoleMobile'
import connectDb from '@/lib/db'
import User from '@/models/user.model'
import { redirect } from 'next/navigation'
import React from 'react'

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

  const incomplete = !user.mobile || !user.role

  if (incomplete) {
    return <EditRoleMobile />
  }

  return (
    <div>
      Home Page
    </div>
  )
}

export default Home;