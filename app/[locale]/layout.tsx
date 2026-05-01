import { ReactNode } from "react"
import { NextIntlClientProvider } from "next-intl"
import { getMessages } from "next-intl/server"
import { notFound } from "next/navigation"
import { locales, type Locale } from "@/i18n"

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }))
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: ReactNode
  params: { locale: string }
}) {
  const { locale } = await Promise.resolve(params)

  if (!locales.includes(locale as Locale)) {
    notFound()
  }

  const messages = await getMessages({ locale })

  return <NextIntlClientProvider messages={messages}>{children}</NextIntlClientProvider>
}
