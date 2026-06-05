'use client'

import { getSocket } from '@/lib/socket'
import React, { useEffect, useRef } from 'react'

function GeoUpdater({ userId }: { userId: string }) {
  const lastSentRef = useRef(0)

  useEffect(() => {
    if (!userId) return
    if (!navigator.geolocation) return

    const socket = getSocket()

    const watcher = navigator.geolocation.watchPosition(
      (pos) => {
        const now = Date.now()

        
        if (now - lastSentRef.current < 5000) return

        lastSentRef.current = now

        socket.emit('update-location', {
          userId,
          latitude: pos.coords.latitude,
          longitude: pos.coords.longitude,
        })
      },
      (err) => {
        console.log('Geolocation Error:', err)
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 5000,
      }
    )

    return () => {
      navigator.geolocation.clearWatch(watcher)
    }
  }, [userId])

  return null
}

export default GeoUpdater