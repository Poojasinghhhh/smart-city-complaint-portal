"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { FieldGroup, Field, FieldLabel } from "@/components/ui/field"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { LocationPicker } from "@/components/location-picker"
import { AlertCircle, Send, Construction, Droplets, Zap, Trash2, Lightbulb, Waves, CheckCircle } from "lucide-react"
import { StatusBadge } from "@/components/ui/status-badge"
import { LoadingSpinner } from "@/components/ui/loading-spinner"

const CATEGORIES = [
  { value: "roads", label: "Roads & Potholes", icon: Construction, color: "bg-orange-100 text-orange-600" },
  { value: "water", label: "Water Supply", icon: Droplets, color: "bg-blue-100 text-blue-600" },
  { value: "electricity", label: "Electricity", icon: Zap, color: "bg-yellow-100 text-yellow-600" },
  { value: "sanitation", label: "Sanitation & Garbage", icon: Trash2, color: "bg-green-100 text-green-600" },
  { value: "streetlights", label: "Streetlights", icon: Lightbulb, color: "bg-purple-100 text-purple-600" },
  { value: "drainage", label: "Drainage & Sewage", icon: Waves, color: "bg-cyan-100 text-cyan-600" },
]

interface EnhancedComplaintFormProps {
  userId: string
}

export function EnhancedComplaintForm({ userId }: EnhancedComplaintFormProps) {
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [category, setCategory] = useState("")
  const [latitude, setLatitude] = useState<number | null>(null)
  const [longitude, setLongitude] = useState<number | null>(null)
  const [address, setAddress] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)
  const [step, setStep] = useState(1)
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!latitude || !longitude) {
      setError("Please select a location on the map")
      return
    }

    if (!category) {
      setError("Please select a category")
      return
    }

    if (!title.trim()) {
      setError("Please enter a complaint title")
      return
    }

    if (!description.trim()) {
      setError("Please enter a complaint description")
      return
    }

    setLoading(true)
    setError(null)

    try {
      console.log("=== COMPLAINT SUBMISSION DEBUG ===")
      console.log("Creating Supabase client...")
      
      const envVars = {
        NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL,
        NEXT_PUBLIC_SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
        SUPABASE_SERVICE_ROLE_KEY: process.env.SUPABASE_SERVICE_ROLE_KEY,
        NODE_ENV: process.env.NODE_ENV
      }
      
      console.log("Environment variables check:")
      Object.entries(envVars).forEach(([key, value]) => {
        console.log(`${key}:`, value ? `${value.substring(0, 20)}...` : "MISSING")
      })
      
      if (!process.env.NEXT_PUBLIC_SUPABASE_URL) {
        setError("NEXT_PUBLIC_SUPABASE_URL is missing from .env.local file")
        setLoading(false)
        return
      }
      
      if (!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
        setError("NEXT_PUBLIC_SUPABASE_ANON_KEY is missing from .env.local file")
        setLoading(false)
        return
      }
      
      console.log("Environment variables validated, creating client...")
      const supabase = createClient()
      
      // Test Supabase connection with simple auth check
      console.log("Testing Supabase connection...")
      console.log("Supabase client URL:", process.env.NEXT_PUBLIC_SUPABASE_URL)
      
      try {
        const { data: { session }, error: testError } = await supabase.auth.getSession()
        if (testError) {
          console.error("Supabase connection test failed:", testError)
          console.error("Full error object:", JSON.stringify(testError, null, 2))
          
          if (process.env.NEXT_PUBLIC_SUPABASE_URL?.includes('your-project-id')) {
            setError("Please configure your Supabase credentials in .env.local file.")
          } else if (process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY?.includes('your_supabase')) {
            setError("Please configure your Supabase credentials in .env.local file.")
          } else {
            setError("Database connection failed. Please check your configuration and RLS policies.")
          }
          setLoading(false)
          return
        }
        console.log("Supabase connection test passed")
      } catch (connError) {
        console.error("Supabase connection error:", connError)
        console.error("Connection error details:", JSON.stringify(connError, null, 2))
        setError("Unable to connect to database. Please try again later.")
        setLoading(false)
        return
      }
      
      // Verify user is authenticated
      console.log("Checking user authentication...")
      const { data: { user }, error: authError } = await supabase.auth.getUser()
      if (authError || !user) {
        console.error("Authentication error:", authError)
        setError("You must be logged in to submit a complaint.")
        setLoading(false)
        return
      }
      
      console.log("User authenticated:", { userId: user.id, email: user.email })
      console.log("Submitting complaint:", { userId, title, category, latitude, longitude })
      
      const complaintData = {
        user_id: userId,
        title: title.trim(),
        description: description.trim(),
        category,
        latitude,
        longitude,
        address: address.trim() || null,
        status: "pending",
        priority: "medium",
      }
      
      console.log("Attempting to insert complaint with data:", complaintData)

      console.log("Performing database insert operation...")
      const { data, error: insertError } = await supabase.from("complaints").insert(complaintData).select()

      if (insertError) {
        console.error("Insert error details:", {
          error: insertError,
          message: insertError.message,
          details: insertError.details,
          hint: insertError.hint,
          code: insertError.code
        })
        
        let errorMessage = "Failed to submit complaint"
        if (insertError.message) {
          errorMessage += `: ${insertError.message}`
        }
        if (insertError.code === 'PGRST116') {
          errorMessage = "Permission denied. Please check your account permissions."
        } else if (insertError.code === '23505') {
          errorMessage = "Duplicate complaint. This complaint may already exist."
        } else if (insertError.code === '23503') {
          errorMessage = "Invalid user ID. Please log in again."
        }
        
        setError(errorMessage)
        setLoading(false)
        return
      }

      console.log("Complaint submitted successfully:", data)
      
      setSuccess(true)
      setTimeout(() => {
        router.push("/dashboard?submitted=true")
        router.refresh()
      }, 2000)
      
    } catch (err) {
      console.error("Unexpected error:", err)
      setError("An unexpected error occurred. Please try again.")
      setLoading(false)
    }
  }

  const nextStep = () => {
    if (step < 3) setStep(step + 1)
  }

  const prevStep = () => {
    if (step > 1) setStep(step - 1)
  }

  const isStepValid = () => {
    switch (step) {
      case 1:
        return category.trim() !== ""
      case 2:
        return title.trim() !== "" && description.trim() !== ""
      case 3:
        return latitude !== null && longitude !== null
      default:
        return false
    }
  }

  if (success) {
    return (
      <Card className="max-w-2xl mx-auto border-0 shadow-2xl bg-gradient-to-br from-green-50 to-emerald-50">
        <CardContent className="p-8 text-center">
          <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle className="h-8 w-8 text-green-600" />
          </div>
          <h2 className="text-2xl font-bold text-green-800 mb-2">Complaint Submitted Successfully!</h2>
          <p className="text-green-600 mb-4">Your complaint has been registered and will be processed by the relevant authorities.</p>
          <p className="text-sm text-gray-600">Redirecting to your dashboard...</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="max-w-2xl mx-auto border-0 shadow-2xl bg-white/90 backdrop-blur-sm">
      <CardHeader className="text-center pb-8">
        <div className="flex justify-center mb-4">
          <div className="bg-blue-100 w-12 h-12 rounded-full flex items-center justify-center">
            <Send className="h-6 w-6 text-blue-600" />
          </div>
        </div>
        <CardTitle className="text-2xl font-bold text-gray-900">Register New Complaint</CardTitle>
        <CardDescription className="text-gray-600">
          Help us improve your community by reporting civic issues
        </CardDescription>
        
        {/* Progress Steps */}
        <div className="flex justify-center items-center space-x-4 mt-6">
          {[1, 2, 3].map((stepNumber) => (
            <div key={stepNumber} className="flex items-center">
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium transition-all duration-200 ${
                  step >= stepNumber
                    ? "bg-blue-600 text-white"
                    : "bg-gray-200 text-gray-600"
                }`}
              >
                {stepNumber}
              </div>
              {stepNumber < 3 && (
                <div
                  className={`w-12 h-1 transition-all duration-200 ${
                    step > stepNumber ? "bg-blue-600" : "bg-gray-200"
                  }`}
                />
              )}
            </div>
          ))}
        </div>
      </CardHeader>

      <CardContent className="space-y-6">
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-center space-x-3">
            <AlertCircle className="h-5 w-5 text-red-600 flex-shrink-0" />
            <p className="text-red-800 text-sm">{error}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Step 1: Category Selection */}
          {step === 1 && (
            <div className="space-y-4 animate-fadeIn">
              <Field>
                <FieldLabel className="text-base font-medium">Select Category</FieldLabel>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mt-3">
                  {CATEGORIES.map((cat) => {
                    const Icon = cat.icon
                    return (
                      <button
                        key={cat.value}
                        type="button"
                        onClick={() => setCategory(cat.value)}
                        className={`p-4 rounded-lg border-2 transition-all duration-200 transform hover:scale-105 ${
                          category === cat.value
                            ? "border-blue-500 bg-blue-50 shadow-md"
                            : "border-gray-200 hover:border-gray-300 bg-white"
                        }`}
                      >
                        <div className={`w-10 h-10 rounded-full ${cat.color} flex items-center justify-center mx-auto mb-2`}>
                          <Icon className="h-5 w-5" />
                        </div>
                        <p className="text-sm font-medium text-gray-900">{cat.label}</p>
                      </button>
                    )
                  })}
                </div>
              </Field>
            </div>
          )}

          {/* Step 2: Complaint Details */}
          {step === 2 && (
            <div className="space-y-4 animate-fadeIn">
              <Field>
                <FieldLabel className="text-base font-medium">Complaint Title</FieldLabel>
                <Input
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Brief title describing the issue"
                  className="mt-2"
                  maxLength={100}
                />
                <p className="text-xs text-gray-500 mt-1">{title.length}/100 characters</p>
              </Field>

              <Field>
                <FieldLabel className="text-base font-medium">Detailed Description</FieldLabel>
                <Textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Please provide detailed information about the issue..."
                  className="mt-2 min-h-[120px]"
                  maxLength={500}
                />
                <p className="text-xs text-gray-500 mt-1">{description.length}/500 characters</p>
              </Field>
            </div>
          )}

          {/* Step 3: Location */}
          {step === 3 && (
            <div className="space-y-4 animate-fadeIn">
              <Field>
                <FieldLabel className="text-base font-medium">Select Location</FieldLabel>
                <p className="text-sm text-gray-600 mb-3">
                  Click on the map to mark the exact location of the issue
                </p>
                <LocationPicker
                  latitude={latitude}
                  longitude={longitude}
                  onLocationChange={(lat, lng, address) => {
                    setLatitude(lat)
                    setLongitude(lng)
                    if (address) setAddress(address)
                  }}
                />
                {address && (
                  <div className="mt-3 p-3 bg-gray-50 rounded-lg">
                    <p className="text-sm text-gray-600">
                      <strong>Address:</strong> {address}
                    </p>
                  </div>
                )}
              </Field>
            </div>
          )}

          {/* Navigation Buttons */}
          <div className="flex justify-between pt-6">
            <Button
              type="button"
              variant="outline"
              onClick={prevStep}
              disabled={step === 1}
              className="px-6"
            >
              Previous
            </Button>

            {step < 3 ? (
              <Button
                type="button"
                onClick={nextStep}
                disabled={!isStepValid()}
                className="px-6 bg-blue-600 hover:bg-blue-700"
              >
                Next
              </Button>
            ) : (
              <Button
                type="submit"
                disabled={loading || !isStepValid()}
                className="px-6 bg-green-600 hover:bg-green-700"
              >
                {loading ? (
                  <>
                    <LoadingSpinner size="sm" />
                    Submitting...
                  </>
                ) : (
                  "Submit Complaint"
                )}
              </Button>
            )}
          </div>
        </form>
      </CardContent>
    </Card>
  )
}
