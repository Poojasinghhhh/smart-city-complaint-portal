"use client"

import { useState, useEffect } from "react"
import { cn } from "@/lib/utils"

interface HeroBackgroundProps {
  children: React.ReactNode
  className?: string
  variant?: "gradient" | "particles" | "waves" | "geometric"
  animationSpeed?: "slow" | "medium" | "fast"
}

export function HeroBackground({ 
  children, 
  className, 
  variant = "gradient",
  animationSpeed = "medium"
}: HeroBackgroundProps) {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  const getBackground = () => {
    switch (variant) {
      case "gradient":
        return (
          <>
            <div className="absolute inset-0 bg-gradient-to-br from-blue-400 via-purple-500 to-pink-500 opacity-30" />
            <div className="absolute inset-0 bg-gradient-to-tr from-blue-600 via-cyan-500 to-teal-400 opacity-20" />
            <div className="absolute inset-0 bg-gradient-to-bl from-purple-600 via-pink-500 to-red-500 opacity-10" />
          </>
        )
      case "particles":
        return (
          <div className="absolute inset-0 overflow-hidden">
            {[...Array(50)].map((_, i) => (
              <div
                key={i}
                className="absolute w-2 h-2 bg-white rounded-full opacity-20"
                style={{
                  left: `${Math.random() * 100}%`,
                  top: `${Math.random() * 100}%`,
                  animation: `float ${10 + Math.random() * 20}s ease-in-out infinite`,
                  animationDelay: `${Math.random() * 5}s`
                }}
              />
            ))}
          </div>
        )
      case "waves":
        return (
          <div className="absolute inset-0 overflow-hidden">
            <svg className="absolute bottom-0 w-full h-32" viewBox="0 0 1440 320" preserveAspectRatio="none">
              <path
                className="animate-wave"
                fill="rgba(59, 130, 246, 0.1)"
                d="M0,160 C320,300, 320,160 C640,20, 960,160 C1280,300, 1440,160"
              />
              <path
                className="animate-wave-slow"
                fill="rgba(59, 130, 246, 0.05)"
                d="M0,160 C320,260, 320,160 C640,60, 960,160 C1280,260, 1440,160"
              />
            </svg>
          </div>
        )
      case "geometric":
        return (
          <div className="absolute inset-0 overflow-hidden">
            {[...Array(20)].map((_, i) => (
              <div
                key={i}
                className="absolute border border-blue-200 opacity-10"
                style={{
                  width: `${100 + Math.random() * 200}px`,
                  height: `${100 + Math.random() * 200}px`,
                  left: `${Math.random() * 100}%`,
                  top: `${Math.random() * 100}%`,
                  transform: `rotate(${Math.random() * 360}deg)`,
                  animation: `spin ${20 + Math.random() * 30}s linear infinite`,
                  animationDelay: `${Math.random() * 10}s`
                }}
              />
            ))}
          </div>
        )
      default:
        return null
    }
  }

  const getAnimationSpeed = () => {
    switch (animationSpeed) {
      case "slow": return "animate-pulse-slow"
      case "medium": return "animate-pulse"
      case "fast": return "animate-pulse-fast"
      default: return "animate-pulse"
    }
  }

  if (!mounted) return null

  return (
    <div className={cn("relative min-h-screen overflow-hidden", className)}>
      <div className={cn("absolute inset-0", getAnimationSpeed())}>
        {getBackground()}
      </div>
      <div className="relative z-10">
        {children}
      </div>
    </div>
  )
}
