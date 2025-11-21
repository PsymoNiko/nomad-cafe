"use client"

import * as React from "react"
import { useParams } from "next/navigation"
import { CheckCircle2, Clock, Loader2 } from 'lucide-react'

export default function OrderStatusPage() {
  const params = useParams<{ id: string }>()
  // Simulated status progression
  const [status, setStatus] = React.useState<"created" | "pending" | "paid">("created")

  React.useEffect(() => {
    const timers = [
      setTimeout(() => setStatus("pending"), 1200),
      setTimeout(() => setStatus("paid"), 3000),
    ]
    return () => timers.forEach(clearTimeout)
  }, [])

  return (
    <main className="mx-auto max-w-2xl">
      <h2 className="text-xl font-semibold">Order #{params.id}</h2>
      <p className="mt-1 text-sm text-muted-foreground">
        This page simulates status updates. Hook it to SSE or websockets for realtime.
      </p>

      <div className="mt-6 space-y-3">
        <Step label="Created" active={true} done={status !== "created"} />
        <Step label="Pending confirmation" active={status === "pending"} done={status === "paid"} />
        <Step label="Paid" active={status === "paid"} done={status === "paid"} />
      </div>
    </main>
  )
}

function Step({ label, active, done }: { label: string; active: boolean; done: boolean }) {
  return (
    <div className="flex items-center gap-3 rounded border p-3">
      {done ? (
        <CheckCircle2 className="h-5 w-5 text-green-600" />
      ) : active ? (
        <Loader2 className="h-5 w-5 animate-spin text-primary" />
      ) : (
        <Clock className="h-5 w-5 text-muted-foreground" />
      )}
      <div className="text-sm">{label}</div>
    </div>
  )
}
