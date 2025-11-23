import type React from "react"
import type { Metadata, Viewport } from "next"
import { GeistSans } from "geist/font/sans"
import { GeistMono } from "geist/font/mono"
import { Analytics } from "@vercel/analytics/next"
import { NextIntlClientProvider } from 'next-intl'
import { getMessages } from 'next-intl/server'
import { notFound } from 'next/navigation'
import { locales } from '@/i18n'
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
    icon: "/nomad-logo.jpg",
    apple: "/nomad-logo.jpg",
  },
}

export const viewport: Viewport = {
  themeColor: "#21edd5",
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
}

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }))
}

export default async function RootLayout({
  children,
  params
}: Readonly<{
  children: React.ReactNode
  params: { locale: string }
}>) {
  const { locale } = await Promise.resolve(params)
  
  // Validate that the incoming `locale` parameter is valid
  if (!locales.includes(locale as typeof locales[number])) {
    notFound()
  }

  const messages = await getMessages()
  const isRTL = locale === 'fa'

  return (
    <html lang={locale} dir={isRTL ? 'rtl' : 'ltr'}>
      <body className={`font-sans antialiased ${GeistSans.variable} ${GeistMono.variable}`}>
        <NextIntlClientProvider messages={messages}>
          {children}
          <Analytics />
        </NextIntlClientProvider>
      </body>
    </html>
  )
}
