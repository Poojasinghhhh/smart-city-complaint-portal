"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
import { sendEmail, generateComplaintSubmissionEmail } from "@/lib/email"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { FieldGroup, Field, FieldLabel } from "@/components/ui/field"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { LocationPicker } from "@/components/location-picker"
import { AlertCircle, Send, Construction, Droplets, Zap, Trash2, Lightbulb, Waves } from "lucide-react"

const CATEGORIES = [
  { value: "roads", label: "Roads & Potholes", icon: Construction },
  { value: "water", label: "Water Supply", icon: Droplets },
  { value: "electricity", label: "Electricity", icon: Zap },
  { value: "sanitation", label: "Sanitation & Garbage", icon: Trash2 },
  { value: "streetlights", label: "Streetlights", icon: Lightbulb },
  { value: "drainage", label: "Drainage & Sewage", icon: Waves },
]

interface ComplaintFormProps {
  userId: string
}

export function ComplaintForm({ userId }: ComplaintFormProps) {
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [category, setCategory] = useState("")
  const [latitude, setLatitude] = useState<number | null>(null)
  const [longitude, setLongitude] = useState<number | null>(null)
  const [address, setAddress] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const handleLocationChange = (lat: number, lng: number, addr?: string) => {
    setLatitude(lat)
    setLongitude(lng)
    if (addr) setAddress(addr)
  }

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
      
      // Check all environment variables
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
        // Simple auth test without accessing tables that might have RLS issues
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
      
      // Send email notification
      try {
        // Get user email from auth
        const { data: { user } } = await supabase.auth.getUser()
        
        if (user?.email && data && data[0]) {
          const complaintId = data[0].id
          const emailHtml = generateComplaintSubmissionEmail(complaintId, title)
          
          await sendEmail({
            to: user.email,
            subject: `Complaint Submitted - ${complaintId}`,
            html: emailHtml,
            text: `Your complaint "${title}" has been submitted successfully. Complaint ID: ${complaintId}`
          })
          
          console.log("Email notification sent to:", user.email)
        }
      } catch (emailError) {
        console.error("Failed to send email notification:", emailError)
        // Don't fail the submission if email fails
      }
      
      router.push("/dashboard?submitted=true")
      router.refresh()
    } catch (err) {
      console.error("Unexpected error:", err)
      setError("An unexpected error occurred. Please try again.")
      setLoading(false)
    }
  }

  return (
    <Card className="border-border bg-card">
      <CardHeader>
        <CardTitle className="text-xl text-foreground">Register New Complaint</CardTitle>
        <CardDescription className="text-muted-foreground">
          Provide details about the civic issue you want to report
        </CardDescription>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-6">
          {error && (
            <div className="flex items-center gap-2 rounded-md bg-destructive/10 p-3 text-sm text-destructive">
              <AlertCircle className="h-4 w-4 flex-shrink-0" />
              {error}
            </div>
          )}

          <FieldGroup>
            <Field>
              <FieldLabel htmlFor="category">Category</FieldLabel>
              <Select value={category} onValueChange={setCategory}>
                <SelectTrigger className="bg-input border-border text-foreground">
                  <SelectValue placeholder="Select complaint category" />
                </SelectTrigger>
                <SelectContent>
                  {CATEGORIES.map((cat) => (
                    <SelectItem key={cat.value} value={cat.value}>
                      <div className="flex items-center gap-2">
                        <cat.icon className="h-4 w-4 text-primary" />
                        {cat.label}
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </Field>

            <Field>
              <FieldLabel htmlFor="title">Subject</FieldLabel>
              <Input
                id="title"
                type="text"
                placeholder="Brief description of the issue"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="bg-input border-border text-foreground placeholder:text-muted-foreground"
                required
              />
            </Field>

            <Field>
              <FieldLabel htmlFor="description">Detailed Description</FieldLabel>
              <Textarea
                id="description"
                placeholder="Provide more details about the problem, when it started, impact on residents..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="bg-input border-border text-foreground placeholder:text-muted-foreground min-h-24"
                required
              />
            </Field>

            <Field>
              <FieldLabel>Complaint Location</FieldLabel>
              <LocationPicker
                latitude={latitude}
                longitude={longitude}
                onLocationChange={handleLocationChange}
              />
              {address && (
                <p className="text-sm text-muted-foreground mt-2 line-clamp-2">{address}</p>
              )}
            </Field>
          </FieldGroup>

          <Button type="submit" className="w-full gap-2" disabled={loading}>
            <Send className="h-4 w-4" />
            {loading ? "Submitting..." : "Submit Complaint"}
          </Button>
        </CardContent>
      </form>
    </Card>
  )
}
