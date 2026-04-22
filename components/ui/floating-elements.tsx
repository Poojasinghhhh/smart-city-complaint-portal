"use client"

import { useState, useEffect } from "react"
import { cn } from "@/lib/utils"

interface FloatingElementProps {
  children: React.ReactNode
  className?: string
  direction?: "up" | "down" | "left" | "right"
  delay?: number
  duration?: number
  distance?: number
}

export function FloatingElement({ 
  children, 
  className, 
  direction = "up",
  delay = 0,
  duration = 3000,
  distance = 20
}: FloatingElementProps) {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  const getAnimation = () => {
    const animations = {
      up: `animate-float-up`,
      down: `animate-float-down`,
      left: `animate-float-left`,
      right: `animate-float-right`
    }
    return animations[direction]
  }

  if (!mounted) return null

  return (
    <div 
      className={cn(
        "inline-block",
        className
      )}
      style={{
        animation: `${getAnimation()} ${duration}ms ease-in-out infinite`,
        animationDelay: `${delay}ms`
      }}
    >
      {children}
    </div>
  )
}

interface PulseElementProps {
  children: React.ReactNode
  className?: string
  color?: string
  size?: "sm" | "md" | "lg"
}

export function PulseElement({ 
  children, 
  className, 
  color = "blue",
  size = "md"
}: PulseElementProps) {
  const sizes = {
    sm: "w-8 h-8",
    md: "w-12 h-12",
    lg: "w-16 h-16"
  }

  const colors = {
    blue: "bg-blue-500",
    green: "bg-green-500",
    red: "bg-red-500",
    yellow: "bg-yellow-500",
    purple: "bg-purple-500"
  }

  return (
    <div className={cn("relative", className)}>
      <div 
        className={cn(
          "absolute inset-0 rounded-full animate-pulse",
          colors[color as keyof typeof colors],
          sizes[size]
        )}
      />
      <div className="relative z-10 flex items-center justify-center">
        {children}
      </div>
    </div>
  )
}

interface RotatingElementProps {
  children: React.ReactNode
  className?: string
  duration?: number
  clockwise?: boolean
}

export function RotatingElement({ 
  children, 
  className, 
  duration = 4000,
  clockwise = true
}: RotatingElementProps) {
  return (
    <div 
      className={cn("inline-block", className)}
      style={{
        animation: `spin ${duration}ms linear infinite`,
        animationDirection: clockwise ? "normal" : "reverse"
      }}
    >
      {children}
    </div>
  )
}

interface BounceElementProps {
  children: React.ReactNode
  className?: string
  delay?: number
  duration?: number
}

export function BounceElement({ 
  children, 
  className, 
  delay = 0,
  duration = 2000
}: BounceElementProps) {
  return (
    <div 
      className={cn("inline-block", className)}
      style={{
        animation: `bounce ${duration}ms ease-in-out infinite`,
        animationDelay: `${delay}ms`
      }}
    >
      {children}
    </div>
  )
}
