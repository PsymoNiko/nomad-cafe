import * as React from "react"
import { LoadingScreen } from "@/components/loading-screen"

export default function LocaleLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <>
      <LoadingScreen />
      {children}
    </>
  )
}
