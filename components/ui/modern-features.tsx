"use client"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { AnimatedIcon } from "@/components/ui/animated-icons"
import { 
  FileText, 
  MapPin, 
  MessageSquare, 
  Users, 
  TrendingUp,
  BarChart3,
  Zap,
  Shield,
  Clock,
  CheckCircle,
  Construction
} from "lucide-react"
import { cn } from "@/lib/utils"

interface FeatureCard {
  title: string
  description: string
  icon: any
  color: string
  delay: number
}

const features: FeatureCard[] = [
  {
    title: "Report Issue",
    description: "Submit civic complaints with photos and location details",
    icon: FileText,
    color: "text-blue-600",
    delay: 0
  },
  {
    title: "Track Status",
    description: "Monitor real-time updates on complaint resolution progress",
    icon: MapPin,
    color: "text-green-600",
    delay: 100
  },
  {
    title: "Community Feedback",
    description: "Rate and provide feedback on resolved complaints",
    icon: MessageSquare,
    color: "text-purple-600",
    delay: 200
  }
]

export function ModernFeatures() {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) return null

  return (
    <div className="py-20 bg-gradient-to-b from-white to-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Powerful Features for Smart Governance
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Our platform combines cutting-edge technology with citizen-centric design 
            to create a seamless complaint management experience.
          </p>
        </div>

        {/* Feature Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <Card 
              key={feature.title}
              className={cn(
                "border-0 shadow-lg bg-white/80 backdrop-blur-sm hover:shadow-xl transition-all duration-300 hover:scale-105",
                mounted && "transform translate-y-0 opacity-100"
              )}
              style={{
                animationDelay: `${feature.delay}ms`,
                animation: "fadeInUp 0.6s ease-out forwards",
                opacity: 0,
                transform: "translateY(30px)"
              }}
            >
              <CardContent className="p-8">
                {/* Icon Section */}
                <div className="flex items-center justify-center mb-6">
                  <div className={cn(
                    "w-20 h-20 rounded-2xl flex items-center justify-center shadow-lg",
                    feature.color.includes("blue") && "bg-blue-100",
                    feature.color.includes("green") && "bg-green-100",
                    feature.color.includes("purple") && "bg-purple-100"
                  )}>
                    <AnimatedIcon
                      icon={feature.icon}
                      size="xl"
                      color={feature.color}
                      animation="pulse"
                      delay={feature.delay + 500}
                    />
                  </div>
                </div>

                {/* Content Section */}
                <div className="text-center">
                  <h3 className="text-2xl font-bold text-gray-900 mb-4">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600 leading-relaxed">
                    {feature.description}
                  </p>
                </div>

                {/* Stats/Details */}
                <div className="mt-6 pt-6 border-t border-gray-200">
                  <div className="grid grid-cols-3 gap-4 text-center">
                    <div>
                      <div className="text-3xl font-bold text-gray-900">
                        {index === 0 ? "10K+" : index === 1 ? "500+" : "1M+"}
                      </div>
                      <div className="text-sm text-gray-600">
                        {index === 0 ? "Active Users" : index === 1 ? "Issues Tracked" : "Resolutions"}
                      </div>
                    </div>
                    <div>
                      <div className="text-3xl font-bold text-green-600">
                        {index === 0 ? "99.9%" : index === 1 ? "24/7" : "95%"}
                      </div>
                      <div className="text-sm text-gray-600">
                        {index === 0 ? "Success Rate" : index === 1 ? "Support" : "Satisfaction"}
                      </div>
                    </div>
                    <div>
                      <div className="text-3xl font-bold text-blue-600">
                        {index === 0 ? "2min" : index === 1 ? "Real-time" : "48hrs"}
                      </div>
                      <div className="text-sm text-gray-600">
                        {index === 0 ? "Response Time" : index === 1 ? "Updates" : "Resolution"}
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      <style jsx>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  )
}
