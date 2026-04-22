"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { cn } from "@/lib/utils"

interface AnimatedCardProps {
  children: React.ReactNode
  className?: string
  hover?: boolean
  delay?: number
  onClick?: () => void
}

export function AnimatedCard({ children, className, hover = true, delay = 0, onClick }: AnimatedCardProps) {
  const [isHovered, setIsHovered] = useState(false)

  return (
    <Card
      className={cn(
        "transition-all duration-300 ease-out",
        hover && "hover:shadow-lg hover:scale-105 hover:-translate-y-1",
        isHovered && "shadow-lg scale-105 -translate-y-1",
        onClick && "cursor-pointer",
        className
      )}
      style={{
        animationDelay: `${delay}ms`,
        animation: "fadeInUp 0.6s ease-out forwards",
        opacity: 0
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={onClick}
    >
      {children}
    </Card>
  )
}

interface AnimatedCardContentProps {
  children: React.ReactNode
  className?: string
}

export function AnimatedCardContent({ children, className }: AnimatedCardContentProps) {
  return (
    <CardContent className={cn("transition-all duration-300", className)}>
      {children}
    </CardContent>
  )
}

interface AnimatedCardHeaderProps {
  children: React.ReactNode
  className?: string
}

export function AnimatedCardHeader({ children, className }: AnimatedCardHeaderProps) {
  return (
    <CardHeader className={cn("transition-all duration-300", className)}>
      {children}
    </CardHeader>
  )
}

interface AnimatedCardTitleProps {
  children: React.ReactNode
  className?: string
}

export function AnimatedCardTitle({ children, className }: AnimatedCardTitleProps) {
  return (
    <CardTitle className={cn("transition-all duration-300", className)}>
      {children}
    </CardTitle>
  )
}
