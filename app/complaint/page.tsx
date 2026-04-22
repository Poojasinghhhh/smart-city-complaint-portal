"use client"

import { useState, useEffect } from "react"
import { createClient } from "@/lib/supabase/client"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { 
  FileText, 
  MapPin, 
  Camera, 
  Upload, 
  Send, 
  AlertCircle,
  CheckCircle,
  Clock,
  User
} from "lucide-react"
import { cn } from "@/lib/utils"
import type { Profile } from "@/lib/types"

interface ComplaintData {
  category: string
  title: string
  description: string
  location: string
  priority: string
  images: File[]
}

const CATEGORIES = [
  { value: "roads", label: "Roads & Infrastructure", icon: "Construction", color: "bg-orange-100 text-orange-600" },
  { value: "water", label: "Water Supply", icon: "Droplets", color: "bg-blue-100 text-blue-600" },
  { value: "electricity", label: "Electricity", icon: "Zap", color: "bg-yellow-100 text-yellow-600" },
  { value: "sanitation", label: "Sanitation", icon: "Trash2", color: "bg-green-100 text-green-600" },
  { value: "streetlight", label: "Street Lighting", icon: "Lightbulb", color: "bg-purple-100 text-purple-600" },
  { value: "drainage", label: "Drainage", icon: "Waves", color: "bg-cyan-100 text-cyan-600" },
]

const PRIORITIES = [
  { value: "low", label: "Low", color: "bg-green-100 text-green-600" },
  { value: "medium", label: "Medium", color: "bg-yellow-100 text-yellow-600" },
  { value: "high", label: "High", color: "bg-red-100 text-red-600" },
  { value: "urgent", label: "Urgent", color: "bg-purple-100 text-purple-600" },
]

export default function ComplaintPage() {
  const [profile, setProfile] = useState<Profile | null>(null)
  const [mounted, setMounted] = useState(false)
  const [loading, setLoading] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
  const router = useRouter()

  const [formData, setFormData] = useState<ComplaintData>({
    category: "",
    title: "",
    description: "",
    location: "",
    priority: "medium",
    images: []
  })

  const [previewImages, setPreviewImages] = useState<string[]>([])

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
        } else {
          router.push("/auth/login")
        }
      } catch (error) {
        console.error("Auth check error:", error)
      }
      setMounted(true)
    }

    checkAuth()
  }, [router])

  const handleInputChange = (field: keyof ComplaintData, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
    setError(null)
  }

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || [])
    const validFiles = files.filter(file => file.type.startsWith('image/'))
    
    if (validFiles.length !== files.length) {
      setError("Only image files are allowed")
      return
    }

    if (formData.images.length + validFiles.length > 5) {
      setError("Maximum 5 images allowed")
      return
    }

    setFormData(prev => ({
      ...prev,
      images: [...prev.images, ...validFiles]
    }))

    // Create preview URLs
    const newPreviews = validFiles.map(file => URL.createObjectURL(file))
    setPreviewImages(prev => [...prev, ...newPreviews])
  }

  const removeImage = (index: number) => {
    const newImages = formData.images.filter((_, i) => i !== index)
    const newPreviews = previewImages.filter((_, i) => i !== index)
    
    setFormData(prev => ({
      ...prev,
      images: newImages
    }))
    setPreviewImages(newPreviews)
  }

  const validateForm = (): boolean => {
    if (!formData.category) {
      setError("Please select a category")
      return false
    }
    if (!formData.title.trim()) {
      setError("Please enter a title")
      return false
    }
    if (!formData.description.trim()) {
      setError("Please enter a description")
      return false
    }
    if (!formData.location.trim()) {
      setError("Please enter a location")
      return false
    }
    if (formData.title.length < 5) {
      setError("Title must be at least 5 characters long")
      return false
    }
    if (formData.description.length < 20) {
      setError("Description must be at least 20 characters long")
      return false
    }
    return true
  }

  const uploadImages = async (): Promise<string[]> => {
    const supabase = createClient()
    const imageUrls: string[] = []

    for (const image of formData.images) {
      const fileName = `${Date.now()}-${image.name}`
      const { data, error } = await supabase.storage
        .from('complaint-images')
        .upload(fileName, image)

      if (error) {
        console.error("Image upload error:", error)
        continue
      }

      const { data: { publicUrl } } = supabase.storage
        .from('complaint-images')
        .getPublicUrl(fileName)

      imageUrls.push(publicUrl)
    }

    return imageUrls
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validateForm()) {
      return
    }

    setLoading(true)
    setError(null)
    setSuccess(null)

    try {
      const supabase = createClient()
      
      // Upload images first
      const imageUrls = await uploadImages()

      // Create complaint
      const { data, error } = await supabase
        .from("complaints")
        .insert({
          user_id: profile?.id,
          category: formData.category,
          title: formData.title.trim(),
          description: formData.description.trim(),
          location: formData.location.trim(),
          priority: formData.priority,
          images: imageUrls,
          status: "pending"
        })
        .select()
        .single()

      if (error) {
        throw error
      }

      setSuccess("Complaint submitted successfully! Tracking ID: " + data.id)
      setSubmitted(true)

      // Reset form after 3 seconds
      setTimeout(() => {
        setFormData({
          category: "",
          title: "",
          description: "",
          location: "",
          priority: "medium",
          images: []
        })
        setPreviewImages([])
        setSubmitted(false)
        router.push("/track")
      }, 3000)

    } catch (error: any) {
      console.error("Submit error:", error)
      setError(error.message || "Failed to submit complaint. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  if (!mounted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-4 border-blue-500 border-t-transparent"></div>
      </div>
    )
  }

  if (!profile) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <Card className="w-96">
          <CardContent className="p-6 text-center">
            <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">Authentication Required</h3>
            <p className="text-gray-600 mb-4">Please sign in to submit a complaint</p>
            <Button onClick={() => router.push("/auth/login")}>
              Sign In
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (submitted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <Card className="w-96">
          <CardContent className="p-6 text-center">
            <CheckCircle className="h-12 w-12 text-green-500 mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">Complaint Submitted!</h3>
            <p className="text-gray-600">{success}</p>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <FileText className="h-6 w-6 text-blue-600" />
              <h1 className="text-xl font-bold text-gray-900">Report Issue</h1>
            </div>
            <div className="flex items-center space-x-2">
              <User className="h-5 w-5 text-gray-500" />
              <span className="text-sm text-gray-600">{profile.full_name}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-3xl mx-auto">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <FileText className="h-5 w-5" />
                <span>Submit a New Complaint</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              {error && (
                <Alert className="mb-6 border-red-200 bg-red-50">
                  <AlertCircle className="h-4 w-4 text-red-500" />
                  <AlertDescription className="text-red-700">
                    {error}
                  </AlertDescription>
                </Alert>
              )}

              {success && (
                <Alert className="mb-6 border-green-200 bg-green-50">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  <AlertDescription className="text-green-700">
                    {success}
                  </AlertDescription>
                </Alert>
              )}

              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Category Selection */}
                <div>
                  <Label htmlFor="category" className="text-sm font-medium">
                    Category *
                  </Label>
                  <Select value={formData.category} onValueChange={(value) => handleInputChange("category", value)}>
                    <SelectTrigger className="mt-2">
                      <SelectValue placeholder="Select a category" />
                    </SelectTrigger>
                    <SelectContent>
                      {CATEGORIES.map((category) => (
                        <SelectItem key={category.value} value={category.value}>
                          <div className="flex items-center space-x-2">
                            <span className={category.color}>{category.label}</span>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Title */}
                <div>
                  <Label htmlFor="title" className="text-sm font-medium">
                    Title *
                  </Label>
                  <Input
                    id="title"
                    type="text"
                    placeholder="Brief description of the issue"
                    value={formData.title}
                    onChange={(e) => handleInputChange("title", e.target.value)}
                    className="mt-2"
                    maxLength={100}
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    {formData.title.length}/100 characters
                  </p>
                </div>

                {/* Description */}
                <div>
                  <Label htmlFor="description" className="text-sm font-medium">
                    Description *
                  </Label>
                  <Textarea
                    id="description"
                    placeholder="Provide detailed information about the issue"
                    value={formData.description}
                    onChange={(e) => handleInputChange("description", e.target.value)}
                    className="mt-2"
                    rows={4}
                    maxLength={1000}
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    {formData.description.length}/1000 characters
                  </p>
                </div>

                {/* Location */}
                <div>
                  <Label htmlFor="location" className="text-sm font-medium">
                    Location *
                  </Label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Input
                      id="location"
                      type="text"
                      placeholder="Enter the exact location or address"
                      value={formData.location}
                      onChange={(e) => handleInputChange("location", e.target.value)}
                      className="mt-2 pl-10"
                    />
                  </div>
                </div>

                {/* Priority */}
                <div>
                  <Label htmlFor="priority" className="text-sm font-medium">
                    Priority Level
                  </Label>
                  <Select value={formData.priority} onValueChange={(value) => handleInputChange("priority", value)}>
                    <SelectTrigger className="mt-2">
                      <SelectValue placeholder="Select priority" />
                    </SelectTrigger>
                    <SelectContent>
                      {PRIORITIES.map((priority) => (
                        <SelectItem key={priority.value} value={priority.value}>
                          <div className="flex items-center space-x-2">
                            <Badge className={priority.color}>
                              {priority.label}
                            </Badge>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Image Upload */}
                <div>
                  <Label className="text-sm font-medium">
                    Images (Optional - Max 5 images)
                  </Label>
                  <div className="mt-2">
                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                      <Camera className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                      <p className="text-sm text-gray-600 mb-2">
                        Click to upload images or drag and drop
                      </p>
                      <p className="text-xs text-gray-500">
                        PNG, JPG, GIF up to 10MB each
                      </p>
                      <input
                        type="file"
                        multiple
                        accept="image/*"
                        onChange={handleImageUpload}
                        className="hidden"
                        id="image-upload"
                      />
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => document.getElementById("image-upload")?.click()}
                        className="mt-2"
                      >
                        <Upload className="h-4 w-4 mr-2" />
                        Choose Images
                      </Button>
                    </div>

                    {/* Image Preview */}
                    {previewImages.length > 0 && (
                      <div className="mt-4 grid grid-cols-2 md:grid-cols-3 gap-4">
                        {previewImages.map((preview, index) => (
                          <div key={index} className="relative group">
                            <img
                              src={preview}
                              alt={`Preview ${index + 1}`}
                              className="w-full h-32 object-cover rounded-lg"
                            />
                            <Button
                              type="button"
                              variant="destructive"
                              size="sm"
                              className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
                              onClick={() => removeImage(index)}
                            >
                              ×
                            </Button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                {/* Submit Button */}
                <div className="flex justify-end space-x-4">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => router.push("/dashboard")}
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    disabled={loading}
                    className="min-w-32"
                  >
                    {loading ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent mr-2"></div>
                        Submitting...
                      </>
                    ) : (
                      <>
                        <Send className="h-4 w-4 mr-2" />
                        Submit Complaint
                      </>
                    )}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
