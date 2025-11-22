"use client"

import React from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { TopbarProps } from '@/lib/types/layout'

export const Topbar: React.FC<TopbarProps> = ({ logoUrl, menu, walletButton }) => {
  return (
    <header className="mb-4 flex items-center justify-between rounded-b-lg bg-white p-4 shadow-sm">
      <div className="flex items-center gap-3">
        {logoUrl && (
          <div className="relative h-8 w-8">
            <Image src={logoUrl} alt="logo" fill className="rounded object-cover" />
          </div>
        )}
        <div className="font-semibold">Nomad-Cafe</div>
      </div>
      <nav className="flex items-center gap-4">
        {menu?.map((m, i) => (
          <Link key={i} href={m.target} className="text-sm hover:text-primary">
            {m.label}
          </Link>
        ))}
        {walletButton && (
          <Button size="sm" className="ml-4">
            Connect Wallet
          </Button>
        )}
      </nav>
    </header>
  )
}
