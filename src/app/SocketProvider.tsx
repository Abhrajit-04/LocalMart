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

    const handleConnect = () => {
      console.log("✅ Connected:", socket.id)

      if (userData?._id) {
        socket.emit("identity", userData._id.toString())
      }
    }

    const handleDisconnect = () => {
      console.log("❌ Disconnected")
    }

    socket.on("connect", handleConnect)
    socket.on("disconnect", handleDisconnect)

    // If already connected
    if (socket.connected && userData?._id) {
      socket.emit("identity", userData._id.toString())
    }

    return () => {
      socket.off("connect", handleConnect)
      socket.off("disconnect", handleDisconnect)
    }
  }, [userData?._id])

  return null
}