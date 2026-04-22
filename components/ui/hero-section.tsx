"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { AnimatedImage } from "@/components/ui/animated-image"
import { AnimatedIcon } from "@/components/ui/animated-icons"
import { ArrowRight, Shield, Users, CheckCircle, BarChart3, MapPin, Mail, Phone } from "lucide-react"

export function HeroSection() {
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

      <div className="relative z-10 container mx-auto px-4 py-16">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <div className="space-y-8">
            <div className="space-y-4">
              <Badge className="w-fit bg-blue-100 text-blue-800 hover:bg-blue-200 transition-colors">
                Civic Complaint Management System
              </Badge>
              <h1 className="text-4xl lg:text-6xl font-bold text-gray-900 leading-tight">
                Report & Track
                <span className="text-blue-600"> Civic Issues</span>
                <br />
                Effortlessly
              </h1>
              <p className="text-xl text-gray-600 leading-relaxed">
                Empowering citizens to report civic complaints and track their resolution 
                in real-time. Your voice matters for better community governance.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <Button 
                size="lg" 
                className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 text-lg transition-all duration-200 transform hover:scale-105 hover:shadow-lg"
                onClick={handleGetStarted}
              >
                Get Started
                <ArrowRight className="ml-2 h-5 w-5" />
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
          </div>

          {/* Right Content - Feature Cards with Animated Images */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {FEATURES.map((feature, index) => (
              <AnimatedCard key={feature.title} delay={index * 100} className="border-0 shadow-lg bg-white/80 backdrop-blur-sm hover:shadow-xl transition-all duration-300 hover:scale-105">
                <CardContent className="p-8">
                  <div className="flex items-center justify-center mb-6">
                    <div className="relative">
                      <AnimatedImage
                        src={`/api/placeholder?text=${encodeURIComponent(feature.title)}&w=64&h=64`}
                        alt={feature.title}
                        width={64}
                        height={64}
                        animation="float"
                        delay={index * 200}
                        className="rounded-full"
                      />
                      <div className="absolute -top-2 -right-2">
                        <AnimatedIcon
                          icon={feature.icon}
                          size="sm"
                          color="white"
                          animation="pulse"
                          delay={index * 200 + 500}
                        />
                      </div>
                    </div>
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-4 text-center">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600 text-center leading-relaxed">
                    {feature.description}
                  </p>
                </CardContent>
              </AnimatedCard>
            ))}
                </div>
              </CardContent>
            </Card>

            <Card className="transform hover:scale-105 transition-all duration-300 hover:shadow-xl border-0 shadow-lg bg-white/80 backdrop-blur-sm" style={{ animationDelay: "200ms" }}>
              <CardContent className="p-6">
                <div className="flex items-center space-x-4">
                  <div className="bg-purple-100 p-3 rounded-full">
                    <BarChart3 className="h-6 w-6 text-purple-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg">Real-time Tracking</h3>
                    <p className="text-gray-600">Track your complaint status in real-time</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
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
        .animate-blob {
          animation: blob 7s infinite;
        }
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        .animation-delay-4000 {
          animation-delay: 4s;
        }
      `}</style>
    </div>
  )
}
