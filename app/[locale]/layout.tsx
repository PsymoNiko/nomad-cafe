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
// import * as React from "react"
// import { LoadingScreen } from "@/components/loading-screen"

// export default function LocaleLayout({
//   children,
// }: {
//   children: React.ReactNode
// }) {
//   return (
//     <>
//       <LoadingScreen />
//       {children}
//     </>
//   )
// }


// app/[locale]/layout.tsx
import { ReactNode } from 'react';

// Define your supported locales (match your next-intl config)
const locales = ['en', 'fa']; // example – replace with your actual locales

export async function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export default function LocaleLayout({
  children,
  params,
}: {
  children: ReactNode;
  params: { locale: string };
}) {
  return (
    <html lang={params.locale}>
      <body>{children}</body>
    </html>
  );
}
