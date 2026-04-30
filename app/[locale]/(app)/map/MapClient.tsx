"use client"

import * as React from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { MapPin, Target, Navigation } from "lucide-react"

type Cafe = {
  id: number
  name: string
  address: string
  lat: number
  lng: number
  distance_m: number
  wallet_address: string
}

const NOMAD_CAFE_LAT = Number.parseFloat(process.env.NEXT_PUBLIC_CAFE_LAT || "35.7173075")
const NOMAD_CAFE_LNG = Number.parseFloat(process.env.NEXT_PUBLIC_CAFE_LNG || "51.4185506")
// This function tells Next.js to pre-render the page for each of these locales during the build.
export async function generateStaticParams() {
  // This array of locales MUST match the one in your i18n.ts configuration.
  return [{ locale: 'en' }, { locale: 'fa' }];
}
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
    } catch (e: unknown) {
      const errorMessage = e instanceof Error ? e.message : "Failed to get location. Please enable location services."
      setError(errorMessage)
    } finally {
      setLoading(false)
    }
  }

  function calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
    const R = 6371
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
          {"Locate the nearest Nomad-Cafe locations near you"}
        </p>
      </div>

      <Button
        onClick={locate}
        disabled={loading}
        size="lg"
        className="mb-6 w-full gap-2 md:w-auto"
        style={{ minHeight: "48px" }}
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
          src={`https://maps.google.com/maps?q=${NOMAD_CAFE_LAT},${NOMAD_CAFE_LNG}&hl=en&z=15&output=embed`}
          width="100%"
          height="450"
          style={{ border: 0 }}
          loading="lazy"
          title="Nomad-Cafe location map"
          className="min-h-[300px] md:min-h-[450px]"
        />
      </div>

      <Button asChild variant="outline" className="mb-6 w-full gap-2 bg-transparent" style={{ minHeight: "48px" }}>
        <a
          href={`https://www.google.com/maps/dir/?api=1&destination=${NOMAD_CAFE_LAT},${NOMAD_CAFE_LNG}`}
          target="_blank"
          rel="noopener noreferrer"
        >
          <Navigation className="h-5 w-5" />
          Get Directions to Nomad-Cafe
        </a>
      </Button>

      {!coords && !error && (
        <p className="text-pretty text-sm leading-relaxed text-muted-foreground">
          Click &quot;Use my location&quot; to calculate your distance to Nomad-Cafe and find directions.
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
                  <p className="text-pretty text-sm leading-relaxed text-muted-foreground">{cafe.address}</p>
                </div>
                <div className="shrink-0 rounded-md bg-primary/10 px-3 py-1.5 text-sm font-bold text-primary">
                  {(cafe.distance_m / 1000).toFixed(1)} km
                </div>
              </div>
              <Button asChild variant="outline" className="w-full gap-2 bg-transparent" style={{ minHeight: "44px" }}>
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
