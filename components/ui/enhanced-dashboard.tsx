"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { StatusBadge } from "@/components/ui/status-badge"
import { PriorityBadge } from "@/components/ui/status-badge"
import { AnimatedCard } from "@/components/ui/animated-card"
import { LoadingSpinner } from "@/components/ui/loading-spinner"
import { 
  Clock, 
  AlertCircle, 
  CheckCircle, 
  XCircle, 
  Plus, 
  Filter,
  Search,
  Calendar,
  MapPin,
  TrendingUp,
  Users,
  BarChart3
} from "lucide-react"

interface Complaint {
  id: string
  title: string
  description: string
  category: string
  status: string
  priority: string
  created_at: string
  updated_at?: string
  latitude?: number
  longitude?: number
  address?: string
}

interface EnhancedDashboardProps {
  complaints: Complaint[]
  userId: string
  submitted?: boolean
}

export function EnhancedDashboard({ complaints, userId, submitted }: EnhancedDashboardProps) {
  const [filteredComplaints, setFilteredComplaints] = useState<Complaint[]>(complaints)
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [categoryFilter, setCategoryFilter] = useState<string>("all")
  const [mounted, setMounted] = useState(false)
  const router = useRouter()

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    let filtered = complaints

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(complaint =>
        complaint.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        complaint.description.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

    // Status filter
    if (statusFilter !== "all") {
      filtered = filtered.filter(complaint => complaint.status === statusFilter)
    }

    // Category filter
    if (categoryFilter !== "all") {
      filtered = filtered.filter(complaint => complaint.category === categoryFilter)
    }

    setFilteredComplaints(filtered)
  }, [complaints, searchTerm, statusFilter, categoryFilter])

  const stats = {
    total: complaints.length,
    pending: complaints.filter(c => c.status === 'pending').length,
    inProgress: complaints.filter(c => c.status === 'in_progress').length,
    resolved: complaints.filter(c => c.status === 'resolved').length,
    rejected: complaints.filter(c => c.status === 'rejected').length,
  }

  const categories = [...new Set(complaints.map(c => c.category))]

  const handleNewComplaint = () => {
    router.push("/complaint-form")
  }

  const handleViewDetails = (complaintId: string) => {
    router.push(`/complaints/${complaintId}`)
  }

  if (!mounted) return null

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
      <div className="container mx-auto p-6 space-y-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">My Dashboard</h1>
            <p className="text-gray-600 mt-1">Track and manage your civic complaints</p>
          </div>
          <Button className="bg-blue-600 hover:bg-blue-700" onClick={handleNewComplaint}>
            <Plus className="h-4 w-4 mr-2" />
            New Complaint
          </Button>
        </div>

        {/* Success Message */}
        {submitted && (
          <AnimatedCard className="border-green-200 bg-green-50">
            <CardContent className="p-4">
              <div className="flex items-center space-x-3">
                <CheckCircle className="h-5 w-5 text-green-600" />
                <p className="text-green-800">Your complaint has been submitted successfully!</p>
              </div>
            </CardContent>
          </AnimatedCard>
        )}

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
          <AnimatedCard delay={0}>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
                </div>
                <div className="bg-blue-100 p-3 rounded-full">
                  <BarChart3 className="h-6 w-6 text-blue-600" />
                </div>
              </div>
            </CardContent>
          </AnimatedCard>

          <AnimatedCard delay={100}>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Pending</p>
                  <p className="text-2xl font-bold text-yellow-600">{stats.pending}</p>
                </div>
                <div className="bg-yellow-100 p-3 rounded-full">
                  <Clock className="h-6 w-6 text-yellow-600" />
                </div>
              </div>
            </CardContent>
          </AnimatedCard>

          <AnimatedCard delay={200}>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">In Progress</p>
                  <p className="text-2xl font-bold text-blue-600">{stats.inProgress}</p>
                </div>
                <div className="bg-blue-100 p-3 rounded-full">
                  <AlertCircle className="h-6 w-6 text-blue-600" />
                </div>
              </div>
            </CardContent>
          </AnimatedCard>

          <AnimatedCard delay={300}>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Resolved</p>
                  <p className="text-2xl font-bold text-green-600">{stats.resolved}</p>
                </div>
                <div className="bg-green-100 p-3 rounded-full">
                  <CheckCircle className="h-6 w-6 text-green-600" />
                </div>
              </div>
            </CardContent>
          </AnimatedCard>

          <AnimatedCard delay={400}>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Rejected</p>
                  <p className="text-2xl font-bold text-red-600">{stats.rejected}</p>
                </div>
                <div className="bg-red-100 p-3 rounded-full">
                  <XCircle className="h-6 w-6 text-red-600" />
                </div>
              </div>
            </CardContent>
          </AnimatedCard>
        </div>

        {/* Filters and Search */}
        <AnimatedCard delay={500}>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Filter className="h-5 w-5" />
              Filters
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search complaints..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>
              
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="all">All Statuses</option>
                <option value="pending">Pending</option>
                <option value="in_progress">In Progress</option>
                <option value="resolved">Resolved</option>
                <option value="rejected">Rejected</option>
              </select>

              <select
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="all">All Categories</option>
                {categories.map(cat => (
                  <option key={cat} value={cat}>
                    {cat.charAt(0).toUpperCase() + cat.slice(1)}
                  </option>
                ))}
              </select>
            </div>
          </CardContent>
        </AnimatedCard>

        {/* Complaints List */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold text-gray-900">
              Your Complaints ({filteredComplaints.length})
            </h2>
            <div className="text-sm text-gray-600">
              Showing {filteredComplaints.length} of {complaints.length}
            </div>
          </div>

          {filteredComplaints.length === 0 ? (
            <AnimatedCard delay={600}>
              <CardContent className="p-12 text-center">
                <div className="bg-gray-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <AlertCircle className="h-8 w-8 text-gray-400" />
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">No complaints found</h3>
                <p className="text-gray-600 mb-4">
                  {complaints.length === 0 
                    ? "You haven't submitted any complaints yet."
                    : "No complaints match your current filters."
                  }
                </p>
                {complaints.length === 0 && (
                  <Button className="bg-blue-600 hover:bg-blue-700" onClick={handleNewComplaint}>
                    <Plus className="h-4 w-4 mr-2" />
                    Submit Your First Complaint
                  </Button>
                )}
              </CardContent>
            </AnimatedCard>
          ) : (
            <div className="space-y-4">
              {filteredComplaints.map((complaint, index) => (
                <AnimatedCard key={complaint.id} delay={600 + index * 100}>
                  <CardContent className="p-6">
                    <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex flex-wrap items-center gap-3 mb-3">
                          <h3 className="text-lg font-semibold text-gray-900">
                            {complaint.title}
                          </h3>
                          <StatusBadge status={complaint.status} />
                          <PriorityBadge priority={complaint.priority} />
                          <Badge variant="outline" className="capitalize">
                            {complaint.category}
                          </Badge>
                        </div>
                        
                        <p className="text-gray-600 mb-4 line-clamp-2">
                          {complaint.description}
                        </p>
                        
                        <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500">
                          <div className="flex items-center gap-1">
                            <Calendar className="h-4 w-4" />
                            <span>
                              {new Date(complaint.created_at).toLocaleDateString()}
                            </span>
                          </div>
                          
                          {complaint.address && (
                            <div className="flex items-center gap-1">
                              <MapPin className="h-4 w-4" />
                              <span className="line-clamp-1">{complaint.address}</span>
                            </div>
                          )}
                          
                          <div className="flex items-center gap-1">
                            <span className="font-medium">ID:</span>
                            <span className="font-mono text-xs">
                              {complaint.id.substring(0, 8)}...
                            </span>
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        <Button variant="outline" size="sm" onClick={() => handleViewDetails(complaint.id)}>
                          View Details
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </AnimatedCard>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
