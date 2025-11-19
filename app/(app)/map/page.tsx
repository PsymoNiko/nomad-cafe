"use client"

import * as React from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { MapPin, Target, Navigation } from 'lucide-react'

type Cafe = {
  id: number
  name: string
  address: string
  lat: number
  lng: number
  distance_m: number
  wallet_address: string
}

const NOMAD_CAFE_LAT = parseFloat(process.env.NEXT_PUBLIC_CAFE_LAT || "35.6892")
const NOMAD_CAFE_LNG = parseFloat(process.env.NEXT_PUBLIC_CAFE_LNG || "51.3890")

export default function MapPage() {
  const [coords, setCoords] = React.useState<{ lat: number; lng: number } | null>(null)
  const [cafes, setCafes] = React.useState<Cafe[]>([])
  const [loading, setLoading] = React.useState(false)
  const [error, setError] = React.useState<string | null>(null)
  const [distance, setDistance] = React.useState<number | null>(null)

  async function locate() {
    setError(null)
    setLoading(true)
    try {
      const position = await new Promise<GeolocationPosition>((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, reject, {
          enableHighAccuracy: true,
          timeout: 10000,
        })
      })
      const lat = position.coords.latitude
      const lng = position.coords.longitude
      setCoords({ lat, lng })

      const distanceKm = calculateDistance(lat, lng, NOMAD_CAFE_LAT, NOMAD_CAFE_LNG)
      setDistance(distanceKm)

      const res = await fetch(`/api/cafes/nearest?lat=${lat}&lng=${lng}&limit=5`)
      const data: Cafe[] = await res.json()
      setCafes(data)
    } catch (e: any) {
      setError(e.message || "Failed to get location. Please enable location services.")
    } finally {
      setLoading(false)
    }
  }

  function calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
    const R = 6371 // Earth's radius in km
    const dLat = toRad(lat2 - lat1)
    const dLon = toRad(lon2 - lon1)
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLon / 2) * Math.sin(dLon / 2)
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
    return R * c
  }

  function toRad(degrees: number): number {
    return degrees * (Math.PI / 180)
  }

  return (
    <main className="pb-8">
      <div className="brand-gradient mb-6 rounded-xl p-6 text-white shadow-lg">
        <h1 className="text-balance text-2xl font-bold">Find Nomad-Cafe</h1>
        <p className="mt-2 text-pretty text-sm leading-relaxed text-white/90">
          {'Locate the nearest Nomad-Cafe locations near you'}
        </p>
      </div>

      <Button 
        onClick={locate} 
        disabled={loading}
        size="lg"
        className="mb-6 w-full gap-2 md:w-auto"
        style={{ minHeight: '48px' }}
      >
        <Target className="h-5 w-5" />
        {loading ? "Locating..." : "Use my location"}
      </Button>

      {distance !== null && (
        <div className="mb-6 rounded-lg border bg-card p-4">
          <div className="flex items-center gap-2">
            <MapPin className="h-5 w-5 text-primary" />
            <span className="font-semibold">Distance to Nomad-Cafe:</span>
            <span className="text-lg font-bold text-primary">{distance.toFixed(2)} km</span>
          </div>
        </div>
      )}

      <div className="mb-6 overflow-hidden rounded-xl border shadow-md">
        <iframe
          src={`https://www.openstreetmap.org/export/embed.html?bbox=${NOMAD_CAFE_LNG - 0.01},${NOMAD_CAFE_LAT - 0.01},${NOMAD_CAFE_LNG + 0.01},${NOMAD_CAFE_LAT + 0.01}&layer=mapnik&marker=${NOMAD_CAFE_LAT},${NOMAD_CAFE_LNG}`}
          width="100%"
          height="400"
          style={{ border: 0 }}
          loading="lazy"
          title="Nomad-Cafe location map"
        />
      </div>

      {!coords && !error && (
        <p className="text-pretty text-sm leading-relaxed text-muted-foreground">
          Click "Use my location" to calculate your distance to Nomad-Cafe and find directions.
        </p>
      )}
      {error && (
        <div className="rounded-lg border-l-4 border-destructive bg-destructive/10 p-4">
          <p className="text-sm font-medium text-destructive">{error}</p>
        </div>
      )}

      <div className="mt-6 space-y-3">
        {cafes.map((cafe) => (
          <article key={cafe.id} className="overflow-hidden rounded-xl border bg-card shadow-sm">
            <div className="p-4">
              <div className="mb-3 flex items-start justify-between gap-3">
                <div className="min-w-0 flex-1">
                  <div className="mb-1 flex items-center gap-2">
                    <h3 className="text-balance text-base font-semibold">{cafe.name}</h3>
                    <Badge variant="secondary" className="shrink-0 text-xs">
                      Nomad-Cafe
                    </Badge>
                  </div>
                  <p className="text-pretty text-sm leading-relaxed text-muted-foreground">
                    {cafe.address}
                  </p>
                </div>
                <div className="shrink-0 rounded-md bg-primary/10 px-3 py-1.5 text-sm font-bold text-primary">
                  {(cafe.distance_m / 1000).toFixed(1)} km
                </div>
              </div>
              <Button
                asChild
                variant="outline"
                className="w-full gap-2"
                style={{ minHeight: '44px' }}
              >
                <a
                  href={`https://www.google.com/maps/dir/?api=1&destination=${cafe.lat},${cafe.lng}`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Navigation className="h-4 w-4" />
                  Get Directions
                </a>
              </Button>
            </div>
          </article>
        ))}
      </div>
    </main>
  )
}
