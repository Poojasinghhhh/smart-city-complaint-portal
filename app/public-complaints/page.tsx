"use client"

import { useState, useEffect } from "react"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { 
  ThumbsUp, 
  Search, 
  MapPin, 
  Calendar, 
  User, 
  AlertTriangle,
  Clock,
  CheckCircle,
  FileText,
  TrendingUp
} from "lucide-react"
import { cn } from "@/lib/utils"

interface Complaint {
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
  upvotes: number
  profiles: {
    full_name: string
    email: string
  }
}

const STATUS_CONFIG = {
  pending: { label: "Pending", color: "bg-yellow-100 text-yellow-600", icon: Clock },
  in_progress: { label: "In Progress", color: "bg-blue-100 text-blue-600", icon: AlertTriangle },
  resolved: { label: "Resolved", color: "bg-green-100 text-green-600", icon: CheckCircle },
  rejected: { label: "Rejected", color: "bg-red-100 text-red-600", icon: CheckCircle }
}

const PRIORITY_CONFIG = {
  low: { label: "Low", color: "bg-green-100 text-green-600" },
  medium: { label: "Medium", color: "bg-yellow-100 text-yellow-600" },
  high: { label: "High", color: "bg-orange-100 text-orange-600" },
  urgent: { label: "Urgent", color: "bg-red-100 text-red-600" }
}

export default function PublicComplaints() {
  const [complaints, setComplaints] = useState<Complaint[]>([])
  const [filteredComplaints, setFilteredComplaints] = useState<Complaint[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [upvotedComplaints, setUpvotedComplaints] = useState<Set<string>>(new Set())

  useEffect(() => {
    fetchComplaints()
    fetchUpvotedComplaints()
  }, [])

  useEffect(() => {
    filterComplaints()
  }, [complaints, searchTerm])

  const fetchComplaints = async () => {
    try {
      const supabase = createClient()
      
      // First try to fetch complaints without the join
      const { data: complaintsData, error: complaintsError } = await supabase
        .from("complaints")
        .select("*")
        .order("created_at", { ascending: false })

      if (complaintsError) {
        console.error("Error fetching complaints:", complaintsError)
        console.error("Error details:", JSON.stringify(complaintsError, null, 2))
        return
      }

      console.log("Fetched complaints:", complaintsData?.length || 0, "complaints")

      // If we have complaints, try to fetch user profiles
      if (complaintsData && complaintsData.length > 0) {
        const userIds = [...new Set(complaintsData.map(c => c.user_id).filter(Boolean))]
        
        if (userIds.length > 0) {
          console.log("Fetching profiles for user IDs:", userIds)
          
          try {
            const { data: profilesData, error: profilesError } = await supabase
              .from("profiles")
              .select("id, full_name, email")
              .in("id", userIds)

            if (profilesError) {
              console.error("Error fetching profiles:", profilesError)
              console.error("Profiles error details:", JSON.stringify(profilesError, null, 2))
              console.log("Using fallback profiles...")
              // Set complaints without profiles
              setComplaints(complaintsData.map(c => ({
                ...c,
                profiles: { full_name: "Unknown User", email: "unknown@example.com" }
              })) as Complaint[])
            } else {
              console.log("Successfully fetched profiles:", profilesData?.length || 0, "profiles")
              
              // Merge complaints with profiles
              const profileMap = (profilesData || []).reduce((acc, profile) => {
                acc[profile.id] = profile
                return acc
              }, {} as Record<string, any>)

              setComplaints(complaintsData.map(c => ({
                ...c,
                profiles: profileMap[c.user_id] || { full_name: "Unknown User", email: "unknown@example.com" }
              })) as Complaint[])
            }
          } catch (profileFetchError) {
            console.error("Unexpected error fetching profiles:", profileFetchError)
            console.log("Using fallback profiles due to unexpected error...")
            setComplaints(complaintsData.map(c => ({
              ...c,
              profiles: { full_name: "Unknown User", email: "unknown@example.com" }
            })) as Complaint[])
          }
        } else {
          console.log("No user IDs found, using fallback profiles")
          setComplaints(complaintsData.map(c => ({
            ...c,
            profiles: { full_name: "Unknown User", email: "unknown@example.com" }
          })) as Complaint[])
        }
      } else {
        setComplaints([])
      }
    } catch (error) {
      console.error("Unexpected error:", error)
      console.error("Error stack:", error instanceof Error ? error.stack : "No stack trace")
    } finally {
      setLoading(false)
    }
  }

  const fetchUpvotedComplaints = async () => {
    try {
      const supabase = createClient()
      const { data: { user } } = await supabase.auth.getUser()
      
      if (!user) return

      const { data } = await supabase
        .from("complaint_upvotes")
        .select("complaint_id")
        .eq("user_id", user.id)

      if (data) {
        setUpvotedComplaints(new Set(data.map(item => item.complaint_id)))
      }
    } catch (error) {
      console.error("Error fetching upvoted complaints:", error)
    }
  }

  const handleUpvote = async (complaintId: string) => {
    try {
      const supabase = createClient()
      const { data: { user } } = await supabase.auth.getUser()
      
      if (!user) {
        alert("Please sign in to upvote complaints")
        return
      }

      const isUpvoted = upvotedComplaints.has(complaintId)

      if (isUpvoted) {
        // Remove upvote
        await supabase
          .from("complaint_upvotes")
          .delete()
          .eq("complaint_id", complaintId)
          .eq("user_id", user.id)

        await supabase
          .from("complaints")
          .update({ upvotes: complaints.find(c => c.id === complaintId)!.upvotes - 1 })
          .eq("id", complaintId)

        setUpvotedComplaints(prev => {
          const newSet = new Set(prev)
          newSet.delete(complaintId)
          return newSet
        })

        setComplaints(prev => prev.map(c => 
          c.id === complaintId 
            ? { ...c, upvotes: c.upvotes - 1 }
            : c
        ))
      } else {
        // Add upvote
        await supabase
          .from("complaint_upvotes")
          .insert({
            complaint_id: complaintId,
            user_id: user.id,
            created_at: new Date().toISOString()
          })

        await supabase
          .from("complaints")
          .update({ upvotes: complaints.find(c => c.id === complaintId)!.upvotes + 1 })
          .eq("id", complaintId)

        setUpvotedComplaints(prev => new Set(prev).add(complaintId))

        setComplaints(prev => prev.map(c => 
          c.id === complaintId 
            ? { ...c, upvotes: c.upvotes + 1 }
            : c
        ))
      }
    } catch (error) {
      console.error("Error upvoting complaint:", error)
    }
  }

  const filterComplaints = () => {
    let filtered = complaints.filter(complaint => {
      const matchesSearch = searchTerm === "" || 
        complaint.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        complaint.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        complaint.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
        complaint.profiles.full_name.toLowerCase().includes(searchTerm.toLowerCase())
      
      return matchesSearch
    })

    setFilteredComplaints(filtered)
  }

  const getUpvoteColor = (upvotes: number) => {
    if (upvotes >= 50) return "border-red-200 bg-red-50"
    if (upvotes >= 20) return "border-orange-200 bg-orange-50"
    if (upvotes >= 10) return "border-yellow-200 bg-yellow-50"
    return "border-gray-200 bg-white"
  }

  const getUpvoteBadgeColor = (upvotes: number) => {
    if (upvotes >= 50) return "bg-red-100 text-red-700"
    if (upvotes >= 20) return "bg-orange-100 text-orange-700"
    if (upvotes >= 10) return "bg-yellow-100 text-yellow-700"
    return "bg-gray-100 text-gray-700"
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const getStatusColor = (status: string) => {
    const config = STATUS_CONFIG[status as keyof typeof STATUS_CONFIG]
    return config ? config.color : "bg-gray-100 text-gray-600"
  }

  const getPriorityColor = (priority: string) => {
    const config = PRIORITY_CONFIG[priority as keyof typeof PRIORITY_CONFIG]
    return config ? config.color : "bg-gray-100 text-gray-600"
  }

  const openImage = (imageUrl: string) => {
    window.open(imageUrl, '_blank')
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-4 border-blue-500 border-t-transparent"></div>
      </div>
    )
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Public Complaints</h1>
          <p className="text-gray-600">Browse and upvote community issues</p>
        </div>
        <div className="flex items-center space-x-2">
          <TrendingUp className="h-5 w-5 text-gray-500" />
          <span className="text-sm text-gray-600">Live Updates</span>
        </div>
      </div>

      {/* Search */}
      <div className="border rounded-lg bg-white p-4">
        <div className="relative">
          <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Search complaints..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      {/* Complaints List */}
      <div className="space-y-4">
        {filteredComplaints.length === 0 ? (
          <div className="border rounded-lg bg-white text-center py-8">
            <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No complaints found</h3>
            <p className="text-gray-600">
              {searchTerm ? "Try adjusting your search" : "No complaints have been submitted yet"}
            </p>
          </div>
        ) : (
          filteredComplaints.map((complaint) => (
            <div key={complaint.id} className={cn("border rounded-lg transition-all hover:shadow-md p-6", getUpvoteColor(complaint.upvotes))}>
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <div className="flex items-center space-x-2 mb-2">
                    <h3 className="text-lg font-semibold">{complaint.title}</h3>
                    <Badge className={getUpvoteBadgeColor(complaint.upvotes)}>
                      {complaint.upvotes} upvotes
                    </Badge>
                  </div>
                  <p className="text-gray-600 line-clamp-2">
                    {complaint.description}
                  </p>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-4 mb-4">
                <div className="flex items-center space-x-2">
                  <User className="h-4 w-4 text-gray-400" />
                  <span className="text-sm text-gray-600">{complaint.profiles.full_name}</span>
                </div>
                
                <div className="flex items-center space-x-2">
                  <MapPin className="h-4 w-4 text-gray-400" />
                  <span className="text-sm text-gray-600">{complaint.location}</span>
                </div>
                
                <div className="flex items-center space-x-2">
                  <Calendar className="h-4 w-4 text-gray-400" />
                  <span className="text-sm text-gray-600">{formatDate(complaint.created_at)}</span>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-2 mb-4">
                <Badge className={getStatusColor(complaint.status)}>
                  {STATUS_CONFIG[complaint.status as keyof typeof STATUS_CONFIG]?.label || complaint.status}
                </Badge>
                <Badge className={getPriorityColor(complaint.priority)}>
                  {PRIORITY_CONFIG[complaint.priority as keyof typeof PRIORITY_CONFIG]?.label || complaint.priority}
                </Badge>
                <Badge variant="outline" className="capitalize">
                  {complaint.category}
                </Badge>
              </div>

              {complaint.images && complaint.images.length > 0 && (
                <div className="mb-4">
                  <div className="flex space-x-2">
                    {complaint.images.slice(0, 3).map((image, index) => (
                      <div
                        key={index}
                        className="w-16 h-16 object-cover rounded cursor-pointer relative overflow-hidden"
                        onMouseDown={() => openImage(image)}
                      >
                        <img
                          src={image}
                          alt={`Complaint image ${index + 1}`}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    ))}
                    {complaint.images.length > 3 && (
                      <div className="w-16 h-16 bg-gray-100 rounded flex items-center justify-center text-sm text-gray-600">
                        +{complaint.images.length - 3}
                      </div>
                    )}
                  </div>
                </div>
              )}

              <div className="flex items-center justify-between">
                <button
                  type="button"
                  className={cn(
                    "inline-flex items-center px-3 py-1.5 text-sm font-medium rounded-md transition-colors",
                    upvotedComplaints.has(complaint.id)
                      ? "bg-blue-600 text-white hover:bg-blue-700"
                      : "border border-gray-300 bg-white text-gray-700 hover:bg-gray-50"
                  )}
                  onMouseDown={() => handleUpvote(complaint.id)}
                >
                  <ThumbsUp className={cn("h-4 w-4 mr-2", upvotedComplaints.has(complaint.id) && "fill-current")} />
                  {upvotedComplaints.has(complaint.id) ? "Upvoted" : "Upvote"}
                </button>
                
                <div className="flex items-center space-x-2 text-sm text-gray-500">
                  {complaint.upvotes >= 50 && (
                    <span className="text-red-600 font-medium">🔥 High Priority</span>
                  )}
                  {complaint.upvotes >= 20 && complaint.upvotes < 50 && (
                    <span className="text-orange-600 font-medium">⚡ Rising</span>
                  )}
                  {complaint.upvotes >= 10 && complaint.upvotes < 20 && (
                    <span className="text-yellow-600 font-medium">📈 Trending</span>
                  )}
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}
