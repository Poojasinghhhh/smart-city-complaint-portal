"use client"

import { useState, useEffect } from "react"
import { cn } from "@/lib/utils"

interface AnimatedImageProps {
  src: string
  alt: string
  className?: string
  width?: number
  height?: number
  animation?: "fade" | "slide" | "zoom" | "rotate"
  delay?: number
  duration?: number
}

export function AnimatedImage({ 
  src, 
  alt, 
  className, 
  width = 400, 
  height = 300,
  animation = "fade",
  delay = 0,
  duration = 1000
}: AnimatedImageProps) {
  const [isVisible, setIsVisible] = useState(false)
  const [isLoaded, setIsLoaded] = useState(false)

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(true)
    }, delay)

    return () => clearTimeout(timer)
  }, [delay])

  const getAnimationClass = () => {
    switch (animation) {
      case "fade":
        return isVisible ? "opacity-100 scale-100" : "opacity-0 scale-95"
      case "slide":
        return isVisible ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"
      case "zoom":
        return isVisible ? "scale-100 opacity-100" : "scale-110 opacity-0"
      case "rotate":
        return isVisible ? "rotate-0 opacity-100" : "rotate-3 opacity-0"
      default:
        return isVisible ? "opacity-100" : "opacity-0"
    }
  }

  return (
    <div 
      className={cn(
        "overflow-hidden transition-all ease-out",
        className
      )}
      style={{
        width: `${width}px`,
        height: `${height}px`,
        transitionDuration: `${duration}ms`,
        transitionDelay: `${delay}ms`
      }}
    >
      <div 
        className={cn(
          "w-full h-full transition-all ease-out",
          getAnimationClass()
        )}
        style={{
          transitionDuration: `${duration}ms`,
          transitionDelay: `${delay}ms`
        }}
      >
        <img
          src={src}
          alt={alt}
          className={cn(
            "w-full h-full object-cover",
            isLoaded ? "opacity-100" : "opacity-0",
            "transition-opacity duration-500"
          )}
          onLoad={() => setIsLoaded(true)}
          style={{
            transitionDuration: "500ms"
          }}
        />
      </div>
    </div>
  )
}
