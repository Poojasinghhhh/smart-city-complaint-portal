"use client"

import { useState, useEffect } from "react"
import { createClient } from "@/lib/supabase/client"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { 
  Search, 
  FileText, 
  Clock, 
  CheckCircle, 
  AlertCircle, 
  MapPin, 
  Calendar,
  User,
  Filter,
  RefreshCw,
  Eye,
  MessageSquare
} from "lucide-react"
import { cn } from "@/lib/utils"
import type { Profile, Complaint } from "@/lib/types"

interface ComplaintWithProfile {
  id: string
  user_id: string
  category: string
  title: string
  description: string
  location: string
  priority: string
  status: string
  images: string[]
  created_at: string
  updated_at: string
  profiles: {
    full_name: string
    avatar_url?: string
  }
}

const STATUS_CONFIG = {
  pending: {
    label: "Pending",
    color: "bg-yellow-100 text-yellow-600",
    icon: Clock,
    description: "Your complaint is being reviewed"
  },
  in_progress: {
    label: "In Progress",
    color: "bg-blue-100 text-blue-600",
    icon: RefreshCw,
    description: "Your complaint is being processed"
  },
  resolved: {
    label: "Resolved",
    color: "bg-green-100 text-green-600",
    icon: CheckCircle,
    description: "Your complaint has been resolved"
  },
  rejected: {
    label: "Rejected",
    color: "bg-red-100 text-red-600",
    icon: AlertCircle,
    description: "Your complaint was rejected"
  }
}

const PRIORITY_CONFIG = {
  low: { label: "Low", color: "bg-green-100 text-green-600" },
  medium: { label: "Medium", color: "bg-yellow-100 text-yellow-600" },
  high: { label: "High", color: "bg-orange-100 text-orange-600" },
  urgent: { label: "Urgent", color: "bg-red-100 text-red-600" }
}

export default function TrackPage() {
  const [profile, setProfile] = useState<Profile | null>(null)
  const [mounted, setMounted] = useState(false)
  const [loading, setLoading] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [complaints, setComplaints] = useState<ComplaintWithProfile[]>([])
  const [selectedComplaint, setSelectedComplaint] = useState<ComplaintWithProfile | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [refreshing, setRefreshing] = useState(false)
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

  useEffect(() => {
    if (profile) {
      fetchComplaints()
    }
  }, [profile])

  const fetchComplaints = async () => {
    setLoading(true)
    setError(null)
    
    try {
      const supabase = createClient()
      
      let query = supabase
        .from("complaints")
        .select(`
          *,
          profiles(full_name, avatar_url)
        `)
        .eq("user_id", profile?.id)
        .order("created_at", { ascending: false })

      const { data, error } = await query

      if (error) {
        throw error
      }

      setComplaints(data as ComplaintWithProfile[])
    } catch (error: any) {
      console.error("Fetch error:", error)
      setError(error.message || "Failed to fetch complaints")
    } finally {
      setLoading(false)
    }
  }

  const handleRefresh = async () => {
    setRefreshing(true)
    await fetchComplaints()
    setRefreshing(false)
  }

  const filteredComplaints = complaints.filter(complaint => {
    const matchesSearch = searchTerm === "" || 
      complaint.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      complaint.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      complaint.location.toLowerCase().includes(searchTerm.toLowerCase())
    
    const matchesStatus = statusFilter === "all" || complaint.status === statusFilter
    
    return matchesSearch && matchesStatus
  })

  const getStatusIcon = (status: string) => {
    const config = STATUS_CONFIG[status as keyof typeof STATUS_CONFIG]
    return config ? config.icon : Clock
  }

  const getStatusColor = (status: string) => {
    const config = STATUS_CONFIG[status as keyof typeof STATUS_CONFIG]
    return config ? config.color : "bg-gray-100 text-gray-600"
  }

  const getPriorityColor = (priority: string) => {
    const config = PRIORITY_CONFIG[priority as keyof typeof PRIORITY_CONFIG]
    return config ? config.color : "bg-gray-100 text-gray-600"
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
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
            <p className="text-gray-600 mb-4">Please sign in to track complaints</p>
            <Button onClick={() => router.push("/auth/login")}>
              Sign In
            </Button>
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
              <Search className="h-6 w-6 text-blue-600" />
              <h1 className="text-xl font-bold text-gray-900">Track Complaint Status</h1>
            </div>
            <div className="flex items-center space-x-4">
              <Button
                variant="outline"
                size="sm"
                onClick={handleRefresh}
                disabled={refreshing}
              >
                <RefreshCw className={cn("h-4 w-4 mr-2", refreshing && "animate-spin")} />
                Refresh
              </Button>
              <div className="flex items-center space-x-2">
                <User className="h-5 w-5 text-gray-500" />
                <span className="text-sm text-gray-600">{profile.full_name}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          {/* Search and Filters */}
          <div className="mb-6">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    placeholder="Search complaints by title, description, or location..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <Filter className="h-4 w-4 text-gray-500" />
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="all">All Status</option>
                  <option value="pending">Pending</option>
                  <option value="in_progress">In Progress</option>
                  <option value="resolved">Resolved</option>
                  <option value="rejected">Rejected</option>
                </select>
              </div>
            </div>
          </div>

          {error && (
            <Alert className="mb-6 border-red-200 bg-red-50">
              <AlertCircle className="h-4 w-4 text-red-500" />
              <AlertDescription className="text-red-700">
                {error}
              </AlertDescription>
            </Alert>
          )}

          {loading ? (
            <div className="flex items-center justify-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-4 border-blue-500 border-t-transparent"></div>
            </div>
          ) : filteredComplaints.length === 0 ? (
            <div className="text-center py-12">
              <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">No complaints found</h3>
              <p className="text-gray-600 mb-4">
                {searchTerm || statusFilter !== "all" 
                  ? "Try adjusting your search or filters" 
                  : "You haven't submitted any complaints yet"}
              </p>
              {!searchTerm && statusFilter === "all" && (
                <Button onClick={() => router.push("/complaint")}>
                  Submit Your First Complaint
                </Button>
              )}
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Complaint List */}
              <div className="lg:col-span-2 space-y-4">
                {filteredComplaints.map((complaint) => (
                  <Card 
                    key={complaint.id} 
                    className="cursor-pointer hover:shadow-md transition-shadow"
                    onClick={() => setSelectedComplaint(complaint)}
                  >
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex-1">
                          <h3 className="text-lg font-semibold text-gray-900 mb-2">
                            {complaint.title}
                          </h3>
                          <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                            {complaint.description}
                          </p>
                          <div className="flex items-center space-x-4 text-sm text-gray-500">
                            <div className="flex items-center space-x-1">
                              <MapPin className="h-4 w-4" />
                              <span>{complaint.location}</span>
                            </div>
                            <div className="flex items-center space-x-1">
                              <Calendar className="h-4 w-4" />
                              <span>{formatDate(complaint.created_at)}</span>
                            </div>
                          </div>
                        </div>
                        <div className="flex flex-col items-end space-y-2">
                          <Badge className={getStatusColor(complaint.status)}>
                            {(() => {
                              const Icon = getStatusIcon(complaint.status)
                              return Icon ? <Icon className="h-3 w-3 mr-1" /> : null
                            })()}
                            {STATUS_CONFIG[complaint.status as keyof typeof STATUS_CONFIG]?.label || complaint.status}
                          </Badge>
                          <Badge className={getPriorityColor(complaint.priority)}>
                            {PRIORITY_CONFIG[complaint.priority as keyof typeof PRIORITY_CONFIG]?.label || complaint.priority}
                          </Badge>
                        </div>
                      </div>
                      
                      {complaint.images && complaint.images.length > 0 && (
                        <div className="flex items-center space-x-2 text-sm text-gray-500">
                          <Eye className="h-4 w-4" />
                          <span>{complaint.images.length} image(s) attached</span>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                ))}
              </div>

              {/* Complaint Details */}
              <div className="lg:col-span-1">
                {selectedComplaint ? (
                  <Card className="sticky top-4">
                    <CardHeader>
                      <CardTitle className="flex items-center space-x-2">
                        <FileText className="h-5 w-5" />
                        <span>Complaint Details</span>
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div>
                        <h4 className="font-semibold text-gray-900 mb-2">Title</h4>
                        <p className="text-gray-600">{selectedComplaint.title}</p>
                      </div>
                      
                      <div>
                        <h4 className="font-semibold text-gray-900 mb-2">Description</h4>
                        <p className="text-gray-600">{selectedComplaint.description}</p>
                      </div>
                      
                      <div>
                        <h4 className="font-semibold text-gray-900 mb-2">Location</h4>
                        <p className="text-gray-600">{selectedComplaint.location}</p>
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="font-semibold text-gray-900 mb-2">Status</h4>
                          <Badge className={getStatusColor(selectedComplaint.status)}>
                            {(() => {
                              const Icon = getStatusIcon(selectedComplaint.status)
                              return Icon ? <Icon className="h-3 w-3 mr-1" /> : null
                            })()}
                            {STATUS_CONFIG[selectedComplaint.status as keyof typeof STATUS_CONFIG]?.label || selectedComplaint.status}
                          </Badge>
                        </div>
                        <div>
                          <h4 className="font-semibold text-gray-900 mb-2">Priority</h4>
                          <Badge className={getPriorityColor(selectedComplaint.priority)}>
                            {PRIORITY_CONFIG[selectedComplaint.priority as keyof typeof PRIORITY_CONFIG]?.label || selectedComplaint.priority}
                          </Badge>
                        </div>
                      </div>
                      
                      <div>
                        <h4 className="font-semibold text-gray-900 mb-2">Submitted</h4>
                        <p className="text-gray-600">{formatDate(selectedComplaint.created_at)}</p>
                      </div>
                      
                      {selectedComplaint.updated_at !== selectedComplaint.created_at && (
                        <div>
                          <h4 className="font-semibold text-gray-900 mb-2">Last Updated</h4>
                          <p className="text-gray-600">{formatDate(selectedComplaint.updated_at)}</p>
                        </div>
                      )}
                      
                      {selectedComplaint.images && selectedComplaint.images.length > 0 && (
                        <div>
                          <h4 className="font-semibold text-gray-900 mb-2">Images</h4>
                          <div className="grid grid-cols-2 gap-2">
                            {selectedComplaint.images.map((image, index) => (
                              <img
                                key={index}
                                src={image}
                                alt={`Complaint image ${index + 1}`}
                                className="w-full h-24 object-cover rounded cursor-pointer"
                                onClick={() => window.open(image, '_blank')}
                              />
                            ))}
                          </div>
                        </div>
                      )}
                      
                      <div className="pt-4 border-t">
                        <p className="text-sm text-gray-500 mb-2">
                          {STATUS_CONFIG[selectedComplaint.status as keyof typeof STATUS_CONFIG]?.description}
                        </p>
                        <div className="flex space-x-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => router.push(`/complaint/${selectedComplaint.id}`)}
                          >
                            <MessageSquare className="h-4 w-4 mr-2" />
                            View Details
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => router.push("/complaint")}
                          >
                            <FileText className="h-4 w-4 mr-2" />
                            New Complaint
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ) : (
                  <Card className="sticky top-4">
                    <CardContent className="p-6 text-center">
                      <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">Select a Complaint</h3>
                      <p className="text-gray-600 text-sm">
                        Click on a complaint from the list to view its details
                      </p>
                    </CardContent>
                  </Card>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
