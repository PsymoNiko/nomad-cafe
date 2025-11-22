"use client"

import React from 'react'
import Image from 'next/image'
import { Button } from '@/components/ui/button'
import { HeroProps } from '@/lib/types/layout'

export const Hero: React.FC<HeroProps> = ({ title, subtitle, ctaText, imageUrl }) => {
  return (
    <section className="my-4 rounded-lg bg-gradient-to-r from-teal-50 to-pink-50 p-6 shadow">
      <div className="grid items-center gap-4 md:grid-cols-2">
        <div>
          <h1 className="mb-2 text-2xl font-bold">{title}</h1>
          <p className="mb-4 text-gray-600">{subtitle}</p>
          {ctaText && (
            <Button className="bg-cyan-400 text-white hover:bg-cyan-500">
              {ctaText}
            </Button>
          )}
        </div>
        {imageUrl && (
          <div className="relative h-64 w-full overflow-hidden rounded-lg shadow">
            <Image
              src={imageUrl}
              alt={title || 'Hero image'}
              fill
              className="object-cover"
            />
          </div>
        )}
      </div>
    </section>
  )
}
