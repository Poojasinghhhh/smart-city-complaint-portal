"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { AnimatedImage } from "@/components/ui/animated-image"
import { AnimatedIcon } from "@/components/ui/animated-icons"
import { ArrowRight, Shield, Users, CheckCircle, BarChart3, MapPin, Mail, Phone } from "lucide-react"

interface Feature {
  title: string
  description: string
  icon: any
  color: string
}

const FEATURES: Feature[] = [
  { title: "Geo-Tagged Complaints", description: "Pin exact location of issues on interactive maps", icon: MapPin, color: "bg-blue-100 text-blue-600" },
  { title: "Status Tracking", description: "Real-time updates on complaint resolution progress", icon: CheckCircle, color: "bg-green-100 text-green-600" },
  { title: "Instant Notifications", description: "Get notified when your complaint status changes", icon: Mail, color: "bg-purple-100 text-purple-600" },
]

export function HeroEnhanced() {
  const [mounted, setMounted] = useState(false)
  const router = useRouter()

  useEffect(() => {
    setMounted(true)
  }, [])

  const handleGetStarted = () => {
    router.push("/auth/sign-up")
  }

  const handleLearnMore = () => {
    router.push("/about")
  }

  if (!mounted) return null

  return (
    <div className="relative min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-200 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-purple-200 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-2000"></div>
        <div className="absolute top-40 left-40 w-80 h-80 bg-pink-200 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-4000"></div>
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-3xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-4 py-1.5 text-sm text-primary mb-6">
            <Shield className="h-4 w-4" />
            Smart City Initiative
          </div>
          
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-foreground leading-tight text-balance">
            Report & Track
            <span className="text-blue-600"> Civic Issues</span>
            <br />
            Effortlessly
          </h1>
          
          <p className="mt-6 text-lg text-muted-foreground max-w-2xl mx-auto text-pretty">
            Empowering citizens to report civic complaints and track their resolution 
            in real-time. Your voice matters for better community governance.
          </p>
          
          <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button 
              size="lg" 
              className="gap-2 bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 text-lg transition-all duration-200 transform hover:scale-105 hover:shadow-lg"
              onClick={handleGetStarted}
            >
              Get Started
              <ArrowRight className="h-5 w-5" />
            </Button>
            <Button 
              variant="outline" 
              size="lg" 
              className="border-2 border-gray-300 hover:border-blue-600 px-8 py-3 text-lg transition-all duration-200"
              onClick={handleLearnMore}
            >
              Learn More
            </Button>
          </div>
        </div>

        {/* Animated Feature Cards */}
        <div className="mt-20 grid grid-cols-1 md:grid-cols-3 gap-8">
          {FEATURES.map((feature, index) => (
            <Card 
              key={feature.title} 
              className="border-0 shadow-lg bg-white/80 backdrop-blur-sm hover:shadow-xl transition-all duration-300 hover:scale-105"
              style={{
                animationDelay: `${index * 100}ms`,
                animation: "fadeInUp 0.6s ease-out forwards",
                opacity: 0
              }}
            >
              <CardContent className="p-8">
                <div className="flex items-center justify-center mb-6">
                  <div className={`w-16 h-16 rounded-2xl ${feature.color} flex items-center justify-center`}>
                    <AnimatedIcon
                      icon={feature.icon}
                      size="lg"
                      color="white"
                      animation="float"
                      delay={index * 200}
                    />
                  </div>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-4 text-center">
                  {feature.title}
                </h3>
                <p className="text-gray-600 text-center leading-relaxed">
                  {feature.description}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Animated Stats */}
        <div className="mt-16 grid grid-cols-3 gap-6">
          <div 
            className="text-center p-8 bg-white/80 backdrop-blur-sm rounded-2xl"
            style={{
              animationDelay: "300ms",
              animation: "fadeInUp 0.6s ease-out forwards",
              opacity: 0
            }}
          >
            <div className="text-3xl font-bold text-blue-600">500+</div>
            <div className="text-sm text-gray-600">Complaints Resolved</div>
          </div>
          
          <div 
            className="text-center p-8 bg-white/80 backdrop-blur-sm rounded-2xl"
            style={{
              animationDelay: "400ms",
              animation: "fadeInUp 0.6s ease-out forwards",
              opacity: 0
            }}
          >
            <div className="text-3xl font-bold text-green-600">24/7</div>
            <div className="text-sm text-gray-600">Support Available</div>
          </div>
          
          <div 
            className="text-center p-8 bg-white/80 backdrop-blur-sm rounded-2xl"
            style={{
              animationDelay: "500ms",
              animation: "fadeInUp 0.6s ease-out forwards",
              opacity: 0
            }}
          >
            <div className="text-3xl font-bold text-purple-600">98%</div>
            <div className="text-sm text-gray-600">Satisfaction Rate</div>
          </div>
        </div>

        {/* Animated Contact Section */}
        <div className="mt-20 text-center">
          <div 
            className="inline-flex items-center gap-4 mb-8"
            style={{
              animationDelay: "600ms",
              animation: "fadeInUp 0.6s ease-out forwards",
              opacity: 0
            }}
          >
            <AnimatedIcon icon={Mail} size="lg" color="text-blue-600" animation="pulse" />
            <AnimatedIcon icon={Phone} size="lg" color="text-green-600" animation="pulse" delay={200} />
          </div>
          
          <p className="text-lg text-gray-600 max-w-xl mx-auto">
            Need help? Contact our support team
          </p>
          
          <Button 
            size="lg" 
            className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 text-lg"
            onClick={() => router.push("/contact")}
          >
            Contact Support
          </Button>
        </div>
      </div>

      <style jsx>{`
        @keyframes blob {
          0% {
            transform: translate(0px, 0px) scale(1);
          }
          33% {
            transform: translate(30px, -50px) scale(1.1);
          }
          66% {
            transform: translate(-20px, 20px) scale(0.9);
          }
          100% {
            transform: translate(0px, 0px) scale(1);
          }
        }
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
        .animate-blob {
          animation: blob 7s infinite;
        }
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        .animation-delay-4000 {
          animation-delay: 4s;
        }
        .animate-float {
          animation: float 3s ease-in-out infinite;
        }
        .animate-pulse {
          animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
        }
      `}</style>
    </div>
  )
}
