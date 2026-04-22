"use client"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { AnimatedIcon } from "@/components/ui/animated-icons"
import { 
  CheckCircle, 
  Users, 
  Clock, 
  TrendingUp,
  BarChart3,
  Zap,
  Shield
} from "lucide-react"
import { cn } from "@/lib/utils"

interface StatCard {
  title: string
  value: string | number
  change?: string
  icon: any
  color: string
  delay: number
}

const stats: StatCard[] = [
  {
    title: "Complaints Resolved",
    value: "500+",
    change: "+12%",
    icon: CheckCircle,
    color: "text-blue-600",
    delay: 0
  },
  {
    title: "Support Available",
    value: "24/7",
    change: "Always",
    icon: Clock,
    color: "text-green-600",
    delay: 100
  },
  {
    title: "Satisfaction Rate",
    value: "98%",
    change: "+2%",
    icon: TrendingUp,
    color: "text-purple-600",
    delay: 200
  }
]

export function ModernStats() {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) return null

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {stats.map((stat, index) => (
        <Card 
          key={stat.title}
          className={cn(
            "border-0 shadow-lg bg-white/80 backdrop-blur-sm hover:shadow-xl transition-all duration-300 hover:scale-105",
            mounted && "transform translate-y-0 opacity-100"
          )}
          style={{
            animationDelay: `${stat.delay}ms`,
            animation: "fadeInUp 0.6s ease-out forwards",
            opacity: 0,
            transform: "translateY(30px)"
          }}
        >
          <CardContent className="p-8 text-center">
            {/* Icon */}
            <div className={cn(
              "w-16 h-16 rounded-2xl flex items-center justify-center mb-6 mx-auto",
              stat.color.includes("blue") && "bg-blue-100",
              stat.color.includes("green") && "bg-green-100", 
              stat.color.includes("purple") && "bg-purple-100"
            )}>
              <AnimatedIcon
                icon={stat.icon}
                size="lg"
                color={stat.color}
                animation="pulse"
                delay={stat.delay + 500}
              />
            </div>
            
            {/* Value */}
            <div className="text-3xl font-bold text-gray-900 mb-2">
              {stat.value}
            </div>
            
            {/* Title */}
            <div className="text-sm text-gray-600 mb-2">
              {stat.title}
            </div>
            
            {/* Change Indicator */}
            {stat.change && (
              <div className="flex items-center justify-center space-x-1">
                <TrendingUp className="w-4 h-4 text-green-500" />
                <span className="text-sm font-medium text-green-600">
                  {stat.change}
                </span>
              </div>
            )}
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
