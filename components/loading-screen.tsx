"use client"

import * as React from "react"
import Image from "next/image"

export function LoadingScreen() {
  const [show, setShow] = React.useState(true)

  React.useEffect(() => {
    const timer = setTimeout(() => setShow(false), 2000)
    return () => clearTimeout(timer)
  }, [])

  if (!show) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-background">
      <div className="flex flex-col items-center gap-6">
        <div className="relative">
          <div
            className="absolute inset-0 animate-spin-slow rounded-full border-4 border-primary/30 border-t-primary"
            style={{ width: 120, height: 120 }}
          />
          <div className="flex h-[120px] w-[120px] items-center justify-center overflow-hidden rounded-full bg-white shadow-lg">
            <Image src="/nomad-logo.jpg" alt="Nomad-Cafe Logo" width={100} height={100} className="object-contain" />
          </div>
        </div>
        <h1 className="brand-gradient bg-clip-text text-3xl font-bold text-transparent">Nomad-Cafe</h1>
      </div>
    </div>
  )
}
