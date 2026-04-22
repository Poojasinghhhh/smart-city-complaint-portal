"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { 
  Menu, 
  X, 
  User, 
  Settings,
  Bell,
  Search,
  ChevronDown
} from "lucide-react"
import { cn } from "@/lib/utils"

interface ModernNavbarProps {
  userName?: string
  userAvatar?: string
}

export function ModernNavbar({ userName, userAvatar }: ModernNavbarProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)
  const router = useRouter()

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10)
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const handleDashboard = () => {
    router.push("/dashboard")
  }

  const handleProfile = () => {
    router.push("/profile")
  }

  const handleNotifications = () => {
    router.push("/notifications")
  }

  return (
    <nav className={cn(
      "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
      isScrolled 
        ? "bg-white/95 backdrop-blur-md shadow-lg border-b border-gray-200/50" 
        : "bg-transparent"
    )}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo Section */}
          <div className="flex items-center space-x-2">
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
          <div className="hidden md:flex items-center space-x-8">
            <Button 
              variant="ghost" 
              size="sm"
              onClick={() => router.push("/")}
              className="text-gray-700 hover:text-blue-600 font-medium transition-colors"
            >
              Home
            </Button>
            <Button 
              variant="ghost" 
              size="sm"
              onClick={() => router.push("/complaint-form")}
              className="text-gray-700 hover:text-blue-600 font-medium transition-colors"
            >
              Report Issue
            </Button>
            <Button 
              variant="ghost" 
              size="sm"
              onClick={() => router.push("/track")}
              className="text-gray-700 hover:text-blue-600 font-medium transition-colors"
            >
              Track Status
            </Button>
            <Button 
              variant="ghost" 
              size="sm"
              onClick={() => router.push("/about")}
              className="text-gray-700 hover:text-blue-600 font-medium transition-colors"
            >
              About
            </Button>
          </div>

          {/* User Section */}
          <div className="flex items-center space-x-4">
            {userName ? (
              <>
                {/* Notification Button */}
                <Button 
                  variant="ghost" 
                  size="sm"
                  onClick={handleNotifications}
                  className="relative text-gray-700 hover:text-blue-600 transition-colors"
                >
                  <Bell className="h-4 w-4" />
                  <span className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full"></span>
                </Button>

                {/* User Menu */}
                <div className="relative">
                  <Button 
                    variant="ghost" 
                    size="sm"
                    onClick={() => setIsMenuOpen(!isMenuOpen)}
                    className="flex items-center space-x-2 text-gray-700 hover:text-blue-600 transition-colors"
                  >
                    {userAvatar ? (
                      <img 
                        src={userAvatar} 
                        alt={userName}
                        className="w-6 h-6 rounded-full object-cover"
                      />
                    ) : (
                      <User className="h-4 w-4" />
                    )}
                    <span className="font-medium">{userName}</span>
                    <ChevronDown className="h-4 w-4" />
                  </Button>

                  {/* Dropdown Menu */}
                  {isMenuOpen && (
                    <div className="absolute right-0 top-full mt-2 w-48 bg-white rounded-xl shadow-xl border border-gray-200/50 backdrop-blur-md">
                      <div className="py-2">
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={handleDashboard}
                          className="w-full justify-start text-gray-700 hover:bg-gray-100 transition-colors"
                        >
                          <div className="flex items-center space-x-2">
                            <Settings className="h-4 w-4" />
                            Dashboard
                          </div>
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={handleProfile}
                          className="w-full justify-start text-gray-700 hover:bg-gray-100 transition-colors"
                        >
                          <div className="flex items-center space-x-2">
                            <User className="h-4 w-4" />
                            Profile
                          </div>
                        </Button>
                        <hr className="my-2 border-gray-200" />
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={() => {
                            // Handle logout
                            router.push("/auth/login")
                          }}
                          className="w-full justify-start text-red-600 hover:bg-red-50 transition-colors"
                        >
                          Sign Out
                        </Button>
                      </div>
                    </div>
                  )}
                </div>
              </>
            ) : (
              /* Login/Register Buttons */
              <div className="flex items-center space-x-3">
                <Button 
                  variant="ghost" 
                  size="sm"
                  onClick={() => router.push("/auth/login")}
                  className="text-gray-700 hover:text-blue-600 font-medium transition-colors"
                >
                  Sign In
                </Button>
                <Button 
                  size="sm"
                  onClick={() => router.push("/auth/sign-up")}
                  className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-medium transition-all duration-300 transform hover:scale-105"
                >
                  Get Started
                </Button>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <Button 
            variant="ghost" 
            size="sm"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden text-gray-700 hover:text-blue-600 transition-colors"
          >
            {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden absolute top-full left-0 right-0 bg-white/95 backdrop-blur-md border-b border-gray-200/50">
            <div className="p-4 space-y-2">
              <Button 
                variant="ghost" 
                size="sm"
                onClick={() => {
                  setIsMenuOpen(false)
                  router.push("/")
                }}
                className="w-full justify-start text-gray-700 hover:bg-gray-100 transition-colors"
              >
                Home
              </Button>
              <Button 
                variant="ghost" 
                size="sm"
                onClick={() => {
                  setIsMenuOpen(false)
                  router.push("/complaint-form")
                }}
                className="w-full justify-start text-gray-700 hover:bg-gray-100 transition-colors"
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
                className="w-full justify-start text-gray-700 hover:bg-gray-100 transition-colors"
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
                className="w-full justify-start text-gray-700 hover:bg-gray-100 transition-colors"
              >
                About
              </Button>
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}
