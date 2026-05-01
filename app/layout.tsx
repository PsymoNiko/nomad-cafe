import type React from "react"
import type { Metadata, Viewport } from "next"
import { GeistSans } from "geist/font/sans"
import { GeistMono } from "geist/font/mono"
import { Analytics } from "@vercel/analytics/next"
import "./globals.css"

export const metadata: Metadata = {
  title: "Nomad-Cafe | Coffee & TON Payments",
  description: "Experience specialty coffee and artisan treats, powered by TON blockchain payments",
  generator: "v0.app",
  applicationName: "Nomad-Cafe",
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "Nomad-Cafe",
  },
  icons: {
    icon: "/nomad_logo4.png",
    apple: "/nomad_logo4.png",
  },
}

export const viewport: Viewport = {
  themeColor: "#21edd5",
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={`font-sans antialiased ${GeistSans.variable} ${GeistMono.variable}`}>
        {children}
        <Analytics />
      </body>
    </html>
  )
}
