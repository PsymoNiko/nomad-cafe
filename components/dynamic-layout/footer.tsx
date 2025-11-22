"use client"

import React from 'react'
import Link from 'next/link'
import { FooterProps } from '@/lib/types/layout'

export const Footer: React.FC<FooterProps> = ({ links = [], copyright }) => {
  return (
    <footer className="mt-8 rounded-lg bg-white p-6 text-sm shadow">
      <div className="flex justify-between">
        <div>{copyright}</div>
        <div className="flex gap-3">
          {links.map((l, i) => (
            <Link key={i} href={l.url} className="hover:text-primary">
              {l.label}
            </Link>
          ))}
        </div>
      </div>
    </footer>
  )
}
