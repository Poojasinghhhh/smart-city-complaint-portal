"use client"

import { useState, useEffect, useRef } from "react"
import { cn } from "@/lib/utils"

interface ParallaxSectionProps {
  children: React.ReactNode
  className?: string
  speed?: number
  backgroundImage?: string
  height?: string
}

export function ParallaxSection({ 
  children, 
  className, 
  speed = 0.5,
  backgroundImage,
  height = "500px"
}: ParallaxSectionProps) {
  const [offsetY, setOffsetY] = useState(0)
  const sectionRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleScroll = () => {
      if (sectionRef.current) {
        const rect = sectionRef.current.getBoundingClientRect()
        const scrolled = window.scrollY
        const rate = scrolled * speed
        setOffsetY(rate)
      }
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [speed])

  return (
    <div 
      ref={sectionRef}
      className={cn("relative overflow-hidden", className)}
      style={{ height }}
    >
      {backgroundImage && (
        <div 
          className="absolute inset-0 w-full h-full"
          style={{
            backgroundImage: `url(${backgroundImage})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            transform: `translateY(${offsetY}px)`,
            willChange: 'transform'
          }}
        />
      )}
      <div 
        className="relative z-10"
        style={{
          transform: `translateY(${offsetY * 0.5}px)`,
          willChange: 'transform'
        }}
      >
        {children}
      </div>
    </div>
  )
}
