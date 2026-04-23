"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { AnimatedImage } from "@/components/ui/animated-image"
import { AnimatedIcon } from "@/components/ui/animated-icons"
import { ArrowRight, Shield, Users, CheckCircle, MapPin, Mail, Phone, Search, Menu, X } from "lucide-react"
import { cn } from "@/lib/utils"

export function ModernHero() {
  const [mounted, setMounted] = useState(false)
  const [isMenuOpen, setIsMenuOpen] = useState(false)
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

  const handleReportIssue = () => {
    router.push("/complaint")
  }

  const handleTrackStatus = () => {
    router.push("/track")
  }

  if (!mounted) return null

  return (
    <div className="relative min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 overflow-hidden">
      {/* Glassmorphism Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-400/20 rounded-full blur-3xl animate-blob"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-purple-400/20 rounded-full blur-3xl animate-blob animation-delay-2000"></div>
        <div className="absolute top-40 left-40 w-80 h-80 bg-indigo-400/20 rounded-full blur-3xl animate-blob animation-delay-4000"></div>
        
        {/* Geometric Pattern */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute top-20 left-10 w-32 h-32 border border-blue-200/30 rounded-lg rotate-12 animate-float"></div>
          <div className="absolute top-40 right-20 w-24 h-24 border border-purple-200/30 rounded-lg rotate-45 animate-float animation-delay-1000"></div>
          <div className="absolute bottom-20 left-40 w-40 h-40 border border-indigo-200/30 rounded-full rotate-6 animate-float animation-delay-3000"></div>
          <div className="absolute bottom-40 right-10 w-28 h-28 border border-blue-200/30 rounded-lg rotate-45 animate-float animation-delay-2000"></div>
        </div>
      </div>

      {/* Navigation Bar */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-200/50 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
                <div className="w-6 h-6 bg-white rounded-lg flex items-center justify-center">
                  <div className="w-4 h-4 bg-gradient-to-br from-blue-600 to-purple-600 rounded"></div>
                </div>
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Smart City
              </span>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-1">
              <Button 
                variant="ghost" 
                size="sm"
                onClick={() => router.push("/")}
                className="text-gray-700 hover:text-blue-600 font-medium transition-all duration-200 hover:bg-blue-50 rounded-lg px-4 py-2"
              >
                Home
              </Button>
              <Button 
                variant="ghost" 
                size="sm"
                onClick={handleReportIssue}
                className="text-gray-700 hover:text-blue-600 font-medium transition-all duration-200 hover:bg-blue-50 rounded-lg px-4 py-2"
              >
                Report Issue
              </Button>
              <Button 
                variant="ghost" 
                size="sm"
                onClick={handleTrackStatus}
                className="text-gray-700 hover:text-blue-600 font-medium transition-all duration-200 hover:bg-blue-50 rounded-lg px-4 py-2"
              >
                Track Status
              </Button>
              <Button 
                variant="ghost" 
                size="sm"
                onClick={() => router.push("/about")}
                className="text-gray-700 hover:text-blue-600 font-medium transition-all duration-200 hover:bg-blue-50 rounded-lg px-4 py-2"
              >
                About
              </Button>
            </div>

            {/* User Section */}
            <div className="flex items-center space-x-3">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-gradient-to-br from-green-400 to-blue-500 rounded-full flex items-center justify-center">
                  <Users className="w-4 h-4 text-white" />
                </div>
                <span className="font-medium text-gray-700">Pooja Singh</span>
              </div>
              <Button 
                variant="ghost" 
                size="sm"
                onClick={() => router.push("/dashboard")}
                className="flex items-center space-x-2 text-gray-700 hover:text-blue-600 font-medium transition-all duration-200 hover:bg-blue-50 rounded-lg px-4 py-2"
              >
                Dashboard
                <ArrowRight className="h-4 w-4" />
              </Button>
            </div>

            {/* Mobile Menu Button */}
            <Button 
              variant="ghost" 
              size="sm"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden text-gray-700 hover:text-blue-600 transition-colors p-2"
            >
              {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
          </div>
        </div>
      </nav>

      {/* Hero Content */}
      <div className="relative z-10 pt-24 pb-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 rounded-full border border-blue-200/50 bg-blue-50/80 backdrop-blur-sm px-6 py-3 text-sm text-blue-700 mb-8">
            <Shield className="h-4 w-4" />
            Smart City Initiative
          </div>
          
          {/* Main Heading */}
          <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-gray-900 leading-tight tracking-tight mb-6">
            Report & Track
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">
              Civic Issues
            </span>
            <br />
            <span className="text-gray-700">Effortlessly</span>
          </h1>
          
          {/* Subtext */}
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed mb-12">
            Empowering citizens to report civic complaints and track their resolution 
            in real-time. Your voice matters for better community governance.
          </p>
          
          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16">
            <Button 
              size="lg" 
              className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 py-4 text-lg font-semibold shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-300"
              onClick={handleGetStarted}
            >
              Get Started
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
            <Button 
              variant="outline" 
              size="lg" 
              className="border-2 border-gray-300 hover:border-blue-600 hover:text-blue-600 px-8 py-4 text-lg font-semibold rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300"
              onClick={handleLearnMore}
            >
              Learn More
            </Button>
          </div>

          {/* Animated Illustration */}
          <div className="relative h-64 mb-16">
            <AnimatedImage
              src="/api/placeholder?text=Smart+City+Platform&h=256&w=512"
              alt="Smart City Platform Illustration"
              width={512}
              height={256}
              animation="float"
              delay={500}
              className="rounded-2xl shadow-2xl"
            />
            
            {/* Floating Icons */}
            <div className="absolute top-4 left-8">
              <AnimatedIcon
                icon={MapPin}
                size="lg"
                color="text-blue-600"
                animation="float"
                delay={1000}
              />
            </div>
            <div className="absolute top-8 right-12">
              <AnimatedIcon
                icon={CheckCircle}
                size="lg"
                color="text-green-600"
                animation="float"
                delay={1500}
              />
            </div>
            <div className="absolute bottom-8 left-16">
              <AnimatedIcon
                icon={Users}
                size="lg"
                color="text-purple-600"
                animation="float"
                delay={2000}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden fixed inset-0 z-50 bg-white/95 backdrop-blur-md">
          <div className="p-4 space-y-2">
            <Button 
              variant="ghost" 
              size="sm"
              onClick={() => {
                setIsMenuOpen(false)
                router.push("/")
              }}
              className="w-full justify-start text-gray-700 hover:bg-gray-100 rounded-lg px-4 py-3"
            >
              Home
            </Button>
            <Button 
              variant="ghost" 
              size="sm"
              onClick={() => {
                setIsMenuOpen(false)
                router.push("/complaint")
              }}
              className="w-full justify-start text-gray-700 hover:bg-gray-100 rounded-lg px-4 py-3"
            >
              Report Issue
            </Button>
            <Button 
              variant="ghost" 
              size="sm"
              onClick={() => {
                setIsMenuOpen(false)
                router.push("/track")
              }}
              className="w-full justify-start text-gray-700 hover:bg-gray-100 rounded-lg px-4 py-3"
            >
              Track Status
            </Button>
            <Button 
              variant="ghost" 
              size="sm"
              onClick={() => {
                setIsMenuOpen(false)
                router.push("/about")
              }}
              className="w-full justify-start text-gray-700 hover:bg-gray-100 rounded-lg px-4 py-3"
            >
              About
            </Button>
          </div>
        </div>
      )}

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
        @keyframes float {
          0%, 100% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(-20px);
          }
        }
        .animate-blob {
          animation: blob 8s infinite;
        }
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        .animation-delay-4000 {
          animation-delay: 4s;
        }
        .animate-float {
          animation: float 4s ease-in-out infinite;
        }
        .animation-delay-1000 {
          animation-delay: 1s;
        }
        .animation-delay-1500 {
          animation-delay: 1.5s;
        }
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        .animation-delay-3000 {
          animation-delay: 3s;
        }
      `}</style>
    </div>
  )
}
