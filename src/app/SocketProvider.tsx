'use client'
import { useEffect } from "react"
import { getSocket } from "@/lib/socket"
import { useSelector } from "react-redux"
import { RootState } from "@/redux/store"

export default function SocketProvider() {
  const { userData } = useSelector((state: RootState) => state.user)

  useEffect(() => {
    const socket = getSocket() 

    if (!socket.connected) {
      socket.connect()
    }

    if (userData?._id) {
  socket.emit("identity", userData._id.toString())
}

    socket.on("connect", () => {
      console.log("✅ Connected:", socket.id)
    })

    socket.on("disconnect", () => {
      console.log("❌ Disconnected")
    })

    return () => {
      socket.off("connect")
      socket.off("disconnect")
    }
  }, [userData])

  return null
}