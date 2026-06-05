'use client'

import React, { useEffect, useState } from 'react'
import dynamic from "next/dynamic"
import { LatLngExpression } from "leaflet"
import { useMap } from 'react-leaflet'

interface ILocation {
  latitude: number
  longitude: number
}

interface Iprops {
  userLocation: ILocation
  deliveryBoyLocation: ILocation
}

const Marker = dynamic(
  () => import("react-leaflet").then(mod => mod.Marker),
  { ssr: false }
)

const MapContainer = dynamic(
  () => import("react-leaflet").then(mod => mod.MapContainer),
  { ssr: false }
)

const TileLayer = dynamic(
  () => import("react-leaflet").then(mod => mod.TileLayer),
  { ssr: false }
)

const Polyline = dynamic(
  () => import("react-leaflet").then(mod => mod.Polyline),
  { ssr: false }
)

const Popup = dynamic(
  () => import("react-leaflet").then(mod => mod.Popup),
  { ssr: false }
)

function RecenterMap({positions}:{positions:[number, number]}){
    const map=useMap()
    useEffect(()=>{
      if(positions[0]!==0 && positions[1]!==0){
       map.flyTo(positions, map.getZoom(), {
  animate: true,
  duration: 1
})
      }
    },[positions,map])

  return null
}

function LiveMap({ userLocation, deliveryBoyLocation }: Iprops) {
  const [L, setL] = useState<any>(null)

  useEffect(() => {
    import("leaflet").then((leaflet) => {
      setL(leaflet)
    })

    import("leaflet/dist/leaflet.css")
  }, [])

  // Prevent createIcon crash
  if (!L) {
    return (
      <div className="w-full h-[500px] flex items-center justify-center bg-gray-100">
        Loading Map...
      </div>
    )
  }

  // Prevent rendering map with invalid location
  if (
    !userLocation ||
    userLocation.latitude === 0 ||
    userLocation.longitude === 0
  ) {
    return (
      <div className="w-full h-[500px] flex items-center justify-center bg-gray-100">
        Loading Location...
      </div>
    )
  }

  const deliveryBoyIcon = L.icon({
    iconUrl: "https://cdn-icons-png.flaticon.com/128/9561/9561688.png",
    iconSize: [45, 45],
  })

  const userIcon = L.icon({
    iconUrl: "https://cdn-icons-png.flaticon.com/128/4821/4821951.png",
    iconSize: [45, 45],
  })

  const linePositions =
    deliveryBoyLocation &&
    deliveryBoyLocation.latitude !== 0 &&
    deliveryBoyLocation.longitude !== 0
      ? [
          [userLocation.latitude, userLocation.longitude],
          [deliveryBoyLocation.latitude, deliveryBoyLocation.longitude],
        ]
      : []

  const center: LatLngExpression = [
    userLocation.latitude,
    userLocation.longitude,
  ]

  return (
   <div className="w-full h-[500px] rounded-[24px] overflow-hidden relative">
      <MapContainer
        center={center}
        zoom={13}
        scrollWheelZoom={true}
        className="w-full h-full rounded-xl"
      >
        <RecenterMap
  positions={
    deliveryBoyLocation.latitude !== 0
      ? [
          deliveryBoyLocation.latitude,
          deliveryBoyLocation.longitude,
        ]
      : [
          userLocation.latitude,
          userLocation.longitude,
        ]
  }
/>
        <TileLayer
          attribution="&copy; OpenStreetMap contributors"
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        <Marker
          position={[
            userLocation.latitude,
            userLocation.longitude,
          ]}
          icon={userIcon}
        >
          <Popup>Delivery Address</Popup>
        </Marker>

        {deliveryBoyLocation &&
          deliveryBoyLocation.latitude !== 0 &&
          deliveryBoyLocation.longitude !== 0 && (
            <Marker
              position={[
                deliveryBoyLocation.latitude,
                deliveryBoyLocation.longitude,
              ]}
              icon={deliveryBoyIcon}
            >
              <Popup>Delivery Boy</Popup>
            </Marker>
          )}

        {linePositions.length > 0 && (
          <Polyline positions={linePositions as any} />
        )}
      </MapContainer>
    </div>
  )
}

export default LiveMap