"use client"

import { useState, useEffect } from "react"
import { cn } from "@/lib/utils"
import { 
  MapPin, 
  Mail, 
  Phone, 
  Clock, 
  CheckCircle, 
  AlertCircle, 
  TrendingUp,
  Users,
  Shield,
  Zap,
  Droplets,
  Trash2,
  Lightbulb,
  Waves
} from "lucide-react"

interface AnimatedIconProps {
  icon: any // Accept any Lucide icon component
  className?: string
  size?: "sm" | "md" | "lg" | "xl"
  color?: string
  animation?: "bounce" | "pulse" | "spin" | "float" | "static" | "none"
  delay?: number
  duration?: number
}

const iconMap = {
  mapPin: MapPin,
  mail: Mail,
  phone: Phone,
  clock: Clock,
  checkCircle: CheckCircle,
  alertCircle: AlertCircle,
  trendingUp: TrendingUp,
  users: Users,
  shield: Shield,
  zap: Zap,
  droplets: Droplets,
  trash2: Trash2,
  lightbulb: Lightbulb,
  waves: Waves
}

const sizes = {
  sm: "w-4 h-4",
  md: "w-6 h-6", 
  lg: "w-8 h-8",
  xl: "w-12 h-12"
}

export function AnimatedIcon({ 
  icon, 
  className, 
  size = "md",
  color = "currentColor",
  animation = "none",
  delay = 0,
  duration = 2000
}: AnimatedIconProps) {
  const [mounted, setMounted] = useState(false)
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    setMounted(true)
    const timer = setTimeout(() => {
      setIsVisible(true)
    }, delay)

    return () => clearTimeout(timer)
  }, [delay])

  const IconComponent = iconMap[icon]

  if (!IconComponent) return null

  const getAnimationClass = () => {
    switch (animation) {
      case "bounce":
        return "animate-bounce"
      case "pulse":
        return "animate-pulse"
      case "spin":
        return "animate-spin"
      case "float":
        return "animate-float"
      case "static":
        return ""
      case "none":
        return ""
      default:
        return ""
    }
  }

  if (!mounted) return null

  return (
    <div 
      className={cn(
        "inline-block transition-all duration-500",
        isVisible ? "opacity-100 scale-100" : "opacity-0 scale-95",
        getAnimationClass(),
        className
      )}
      style={{
        color,
        animationDuration: animation !== "static" && animation !== "none" ? `${duration}ms` : undefined,
        animationDelay: animation !== "static" && animation !== "none" ? `${delay}ms` : undefined
      }}
    >
      <IconComponent className={cn(sizes[size], "transition-transform duration-500")} />
    </div>
  )
}

interface IconGroupProps {
  icons: Array<{
    icon: keyof typeof iconMap
    label: string
    value?: string | number
  }>
  className?: string
  direction?: "horizontal" | "vertical"
  animated?: boolean
  stagger?: boolean
}

export function IconGroup({ 
  icons, 
  className, 
  direction = "horizontal",
  animated = true,
  stagger = true
}: IconGroupProps) {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) return null

  const containerClass = cn(
    "flex gap-4",
    direction === "vertical" ? "flex-col" : "flex-row",
    className
  )

  return (
    <div className={containerClass}>
      {icons.map((item, index) => (
        <div 
          key={item.icon}
          className={cn(
            "flex items-center gap-2",
            stagger && "transition-all duration-300"
          )}
          style={{
            animationDelay: stagger && animated ? `${index * 100}ms` : undefined
          }}
        >
          <AnimatedIcon
            icon={item.icon}
            size="md"
            animation={animated ? "float" : "none"}
            delay={stagger ? index * 100 : 0}
          />
          <span className="text-sm font-medium text-gray-700">
            {item.label}
          </span>
          {item.value !== undefined && (
            <span className="text-lg font-bold text-gray-900">
              {item.value}
            </span>
          )}
        </div>
      ))}
    </div>
  )
}
