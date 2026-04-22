"use client"

import { useState, useEffect } from "react"
import { createClient } from "@/lib/supabase/client"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { 
  MapPin, 
  Users, 
  TrendingUp, 
  BarChart3, 
  Shield, 
  Clock, 
  CheckCircle,
  FileText,
  MessageSquare,
  Construction,
  Droplets,
  Zap,
  Trash2,
  Lightbulb,
  Waves
} from "lucide-react"
import { cn } from "@/lib/utils"
import type { Profile } from "@/lib/types"

const CATEGORIES = [
  { icon: Construction, label: "Roads & Infrastructure", description: "Report damaged roads, potholes, and infrastructure issues", color: "bg-orange-100 text-orange-600" },
  { icon: Droplets, label: "Water Supply", description: "Issues with water supply, leakage, or contamination", color: "bg-blue-100 text-blue-600" },
  { icon: Zap, label: "Electricity", description: "Power outages, damaged wires, or billing issues", color: "bg-yellow-100 text-yellow-600" },
  { icon: Trash2, label: "Sanitation", description: "Garbage collection, waste management, cleanliness", color: "bg-green-100 text-green-600" },
  { icon: Lightbulb, label: "Street Lighting", description: "Non-functional or damaged streetlights", color: "bg-purple-100 text-purple-600" },
  { icon: Waves, label: "Drainage", description: "Blocked drains, sewage overflow, waterlogging", color: "bg-cyan-100 text-cyan-600" },
]

const STATS = [
  { icon: TrendingUp, label: "Active Complaints", value: "2,847", description: "Currently being processed", color: "text-blue-600 bg-blue-100" },
  { icon: CheckCircle, label: "Resolved Today", value: "156", description: "Successfully resolved", color: "text-green-600 bg-green-100" },
  { icon: Users, label: "Satisfaction Rate", value: "94.2%", description: "Citizen satisfaction", color: "text-purple-600 bg-purple-100" },
]

const FEATURES = [
  { 
    icon: FileText, 
    title: "Easy Reporting", 
    description: "Submit complaints with photos and location details", 
    color: "bg-blue-100 text-blue-600" 
  },
  { 
    icon: MapPin, 
    title: "Real-Time Tracking", 
    description: "Monitor your complaint status from submission to resolution", 
    color: "bg-green-100 text-green-600" 
  },
  { 
    icon: MessageSquare, 
    title: "Community Feedback", 
    description: "Rate and provide feedback on resolved issues", 
    color: "bg-purple-100 text-purple-600" 
  },
]

interface QuickAction {
  icon: any
  label: string
  href: string
  color: string
  description: string
}

const QUICK_ACTIONS: QuickAction[] = [
  {
    icon: FileText,
    label: "File Complaint",
    href: "/complaint-form",
    color: "bg-blue-600 hover:bg-blue-700",
    description: "Submit new complaint"
  },
  {
    icon: BarChart3,
    label: "View Dashboard",
    href: "/dashboard",
    color: "bg-green-600 hover:bg-green-700",
    description: "Track all complaints"
  },
  {
    icon: Shield,
    label: "Admin Panel",
    href: "/admin",
    color: "bg-purple-600 hover:bg-purple-700",
    description: "Manage complaints"
  },
]

export default function ModernHomepage() {
  const [profile, setProfile] = useState<Profile | null>(null)
  const [mounted, setMounted] = useState(false)
  const router = useRouter()

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const supabase = createClient()
        const { data: { user } } = await supabase.auth.getUser()
        
        if (user) {
          const { data } = await supabase
            .from("profiles")
            .select("*")
            .eq("id", user.id)
            .single()
          setProfile(data as Profile)
        }
      } catch (error) {
        console.error("Auth check error:", error)
      }
    }

    checkAuth()
    setMounted(true)
  }, [])

  if (!mounted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-white">
        <div className="flex items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-4 border-blue-500 border-t-transparent"></div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      {/* Modern Navigation */}
      <nav className="bg-white/90 backdrop-blur-md shadow-lg sticky top-0 z-50 border-b border-gray-200">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-blue-700 rounded-lg flex items-center justify-center">
                <Shield className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold text-gray-900">Smart City</span>
            </div>

            {/* Navigation Links */}
            <div className="hidden md:flex items-center space-x-6">
              <a href="/dashboard" className="text-gray-600 hover:text-blue-600 transition-colors">
                Dashboard
              </a>
              <a href="/complaint-form" className="text-gray-600 hover:text-blue-600 transition-colors">
                Report Issue
              </a>
              <a href="/track" className="text-gray-600 hover:text-blue-600 transition-colors">
                Track Status
              </a>
            </div>

            {/* User Profile */}
            <div className="flex items-center space-x-4">
              {profile ? (
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-purple-600 rounded-full flex items-center justify-center">
                    <Users className="w-5 h-5 text-white" />
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium text-gray-900">{profile.full_name || "User"}</p>
                    <p className="text-xs text-gray-500">Citizen Portal</p>
                  </div>
                </div>
              ) : (
                <Button 
                  onClick={() => router.push('/auth/login')}
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  Sign In
                </Button>
              )}
            </div>

            {/* Mobile Menu */}
            <div className="md:hidden">
              <Button variant="ghost" size="sm">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16m0 0h24" />
                </svg>
              </Button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-blue-600 via-purple-600 to-indigo-700 text-white">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="relative container mx-auto px-4 py-24">
          <div className="text-center">
            {/* Badge */}
            <Badge className="inline-flex items-center px-4 py-2 rounded-full bg-white/20 text-white mb-6">
              <Shield className="w-4 h-4 mr-2" />
              Government Initiative
            </Badge>

            {/* Heading */}
            <h1 className="text-5xl md:text-6xl font-bold mb-6">
              Transform Your City Through Smart
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-orange-500">
                Civic Engagement
              </span>
            </h1>

            {/* Description */}
            <p className="text-xl md:text-2xl mb-8 max-w-3xl mx-auto opacity-90">
              Report, track, and resolve civic issues efficiently with our modern complaint management system. 
              Join thousands of citizens making their communities better.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                size="lg" 
                className="bg-white text-blue-600 hover:bg-gray-100 hover:text-blue-700 border-2 border-white/20"
                onClick={() => router.push('/complaint-form')}
              >
                <FileText className="w-5 h-5 mr-2" />
                Report Issue
              </Button>
              <Button 
                size="lg" 
                variant="outline"
                className="border-white/20 text-white hover:bg-white hover:text-blue-600"
                onClick={() => router.push('/dashboard')}
              >
                <BarChart3 className="w-5 h-5 mr-2" />
                View Dashboard
              </Button>
            </div>
          </div>
        </div>

        {/* Decorative Elements */}
        <div className="absolute top-20 left-10 w-32 h-32 bg-white/10 rounded-full blur-xl"></div>
        <div className="absolute bottom-20 right-10 w-24 h-24 bg-white/10 rounded-full blur-xl"></div>
        <div className="absolute top-40 right-20 w-40 h-40 bg-white/5 rounded-full blur-2xl"></div>
      </section>

      {/* Stats Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Impact at a Glance
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Real-time statistics showing our community's progress
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {STATS.map((stat, index) => (
              <Card key={stat.label} className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
                <CardContent className="p-6 text-center">
                  <div className={`w-16 h-16 rounded-2xl ${stat.color} flex items-center justify-center mb-4 mx-auto`}>
                    <stat.icon className="w-8 h-8" />
                  </div>
                  <div className="space-y-2">
                    <h3 className="text-2xl font-bold text-gray-900">{stat.value}</h3>
                    <p className="text-sm text-gray-600">{stat.label}</p>
                    <p className="text-xs text-gray-500">{stat.description}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Report by Category
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Choose the appropriate category for your civic issue
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
            {CATEGORIES.map((category, index) => (
              <Card key={category.label} className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 cursor-pointer group">
                <CardContent className="p-6 text-center">
                  <div className={`w-16 h-16 rounded-2xl ${category.color} flex items-center justify-center mb-4 mx-auto`}>
                    <category.icon className="w-8 h-8" />
                  </div>
                  <h3 className="text-lg font-bold text-gray-900 mb-2">{category.label}</h3>
                  <p className="text-sm text-gray-600">{category.description}</p>
                  <Button 
                    className="w-full mt-4 opacity-0 group-hover:opacity-100 transition-opacity"
                    onClick={() => router.push('/complaint-form')}
                  >
                    Report {category.label.split(' ')[0]}
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Powerful Features
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Everything you need for effective civic engagement
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {FEATURES.map((feature, index) => (
              <Card key={feature.title} className="border-0 shadow-lg hover:shadow-xl transition-all duration-300">
                <CardContent className="p-6">
                  <div className="flex items-start space-x-4 mb-4">
                    <div className={`w-12 h-12 rounded-xl ${feature.color} flex items-center justify-center flex-shrink-0`}>
                      <feature.icon className="w-6 h-6" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-gray-900 mb-2">{feature.title}</h3>
                      <p className="text-gray-600">{feature.description}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Quick Actions */}
      <section className="py-20 bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Quick Actions
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Get started with the most common tasks
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {QUICK_ACTIONS.map((action, index) => (
              <Card key={action.label} className="border-0 shadow-lg hover:shadow-xl transition-all duration-300">
                <CardContent className="p-6">
                  <div className="flex items-center space-x-4 mb-4">
                    <div className={`w-12 h-12 rounded-xl ${action.color} flex items-center justify-center flex-shrink-0`}>
                      <action.icon className="w-6 h-6" />
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-gray-900 mb-2">{action.label}</h3>
                      <p className="text-sm text-gray-500 mb-4">{action.description}</p>
                      <Button 
                        className={`w-full ${action.color} hover:opacity-90 transition-opacity`}
                        onClick={() => router.push(action.href)}
                      >
                        Get Started
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {/* About */}
            <div>
              <h3 className="text-lg font-bold mb-4">About Smart City</h3>
              <p className="text-gray-400 text-sm mb-4">
                A government initiative for efficient civic issue management and resolution.
              </p>
              <div className="space-y-2">
                <a href="/about" className="text-gray-400 hover:text-white transition-colors">About Us</a>
                <a href="/contact" className="text-gray-400 hover:text-white transition-colors">Contact</a>
              </div>
            </div>

            {/* Quick Links */}
            <div>
              <h3 className="text-lg font-bold mb-4">Quick Links</h3>
              <div className="space-y-2">
                <a href="/dashboard" className="text-gray-400 hover:text-white transition-colors">Dashboard</a>
                <a href="/complaint-form" className="text-gray-400 hover:text-white transition-colors">Report Issue</a>
                <a href="/track" className="text-gray-400 hover:text-white transition-colors">Track Status</a>
              </div>
            </div>

            {/* Services */}
            <div>
              <h3 className="text-lg font-bold mb-4">Services</h3>
              <div className="space-y-2">
                <a href="/emergency" className="text-gray-400 hover:text-white transition-colors">Emergency Services</a>
                <a href="/faq" className="text-gray-400 hover:text-white transition-colors">FAQ</a>
                <a href="/help" className="text-gray-400 hover:text-white transition-colors">Help Center</a>
              </div>
            </div>

            {/* Contact */}
            <div>
              <h3 className="text-lg font-bold mb-4">Contact</h3>
              <div className="space-y-2">
                <p className="text-gray-400">24/7 Helpline: 1800-123-4567</p>
                <p className="text-gray-400">Email: support@smartcity.gov.in</p>
              </div>
            </div>
          </div>

          <div className="border-t border-gray-800 mt-8 pt-8">
            <div className="text-center text-gray-400">
              <p>&copy; 2024 Smart City Portal. All rights reserved.</p>
              <p className="text-sm mt-2">A Government of India Initiative</p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
