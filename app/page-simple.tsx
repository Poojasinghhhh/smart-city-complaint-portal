"use client"

import { useState, useEffect } from "react"
import { createClient } from "@/lib/supabase/client"
import type { Profile } from "@/lib/types"

export default function HomePage() {
  const [profile, setProfile] = useState<Profile | null>(null)
  const [mounted, setMounted] = useState(false)

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

  if (!mounted) return null

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Smart City Complaint Portal
          </h1>
          <p className="text-xl text-gray-600 mb-8">
            Report and track civic issues effortlessly
          </p>
          
          <div className="flex justify-center space-x-4">
            <a 
              href="/complaint-form" 
              className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
            >
              Report Issue
            </a>
            <a 
              href="/track" 
              className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition-colors"
            >
              Track Status
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}
