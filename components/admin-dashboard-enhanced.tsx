"use client"

import { useState, useEffect } from "react"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { 
  Search, 
  Filter, 
  RefreshCw, 
  Eye, 
  Edit, 
  Trash2, 
  CheckCircle, 
  XCircle, 
  Clock, 
  AlertCircle,
  MessageSquare,
  Send,
  FileText,
  MapPin,
  Calendar,
  User,
  TrendingUp,
  BarChart3,
  Users,
  Download
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
  profiles: {
    full_name: string
    email: string
  }
}

interface AdminReply {
  complaint_id: string
  message: string
  admin_id: string
  created_at: string
}

const STATUS_CONFIG = {
  pending: { label: "Pending", color: "bg-yellow-100 text-yellow-600", icon: Clock },
  in_progress: { label: "In Progress", color: "bg-blue-100 text-blue-600", icon: RefreshCw },
  resolved: { label: "Resolved", color: "bg-green-100 text-green-600", icon: CheckCircle },
  rejected: { label: "Rejected", color: "bg-red-100 text-red-600", icon: XCircle }
}

const PRIORITY_CONFIG = {
  low: { label: "Low", color: "bg-green-100 text-green-600" },
  medium: { label: "Medium", color: "bg-yellow-100 text-yellow-600" },
  high: { label: "High", color: "bg-orange-100 text-orange-600" },
  urgent: { label: "Urgent", color: "bg-red-100 text-red-600" }
}

export default function AdminDashboardEnhanced({ complaints: initialComplaints }: { complaints: Complaint[] }) {
  const [complaints, setComplaints] = useState<Complaint[]>(initialComplaints)
  const [filteredComplaints, setFilteredComplaints] = useState<Complaint[]>(initialComplaints)
  const [selectedComplaint, setSelectedComplaint] = useState<Complaint | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [priorityFilter, setPriorityFilter] = useState<string>("all")
  const [categoryFilter, setCategoryFilter] = useState<string>("all")
  const [replyDialogOpen, setReplyDialogOpen] = useState(false)
  const [replyMessage, setReplyMessage] = useState("")
  const [stats, setStats] = useState({
    total: 0,
    pending: 0,
    in_progress: 0,
    resolved: 0,
    rejected: 0
  })

  useEffect(() => {
    setStats({
      total: complaints.length,
      pending: complaints.filter(c => c.status === 'pending').length,
      in_progress: complaints.filter(c => c.status === 'in_progress').length,
      resolved: complaints.filter(c => c.status === 'resolved').length,
      rejected: complaints.filter(c => c.status === 'rejected').length
    })
  }, [complaints])

  useEffect(() => {
    const filtered = complaints.filter(complaint => {
      const matchesSearch = searchTerm === "" || 
        complaint.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        complaint.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        complaint.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
        complaint.profiles.full_name.toLowerCase().includes(searchTerm.toLowerCase())
      
      const matchesStatus = statusFilter === "all" || complaint.status === statusFilter
      const matchesPriority = priorityFilter === "all" || complaint.priority === priorityFilter
      const matchesCategory = categoryFilter === "all" || complaint.category === categoryFilter
      
      return matchesSearch && matchesStatus && matchesPriority && matchesCategory
    })
    
    setFilteredComplaints(filtered)
  }, [complaints, searchTerm, statusFilter, priorityFilter, categoryFilter])

  const handleStatusUpdate = async (complaintId: string, newStatus: string) => {
    setLoading(true)
    setError(null)
    setSuccess(null)
    
    try {
      const supabase = createClient()
      
      const { error } = await supabase
        .from("complaints")
        .update({ 
          status: newStatus,
          updated_at: new Date().toISOString()
        })
        .eq("id", complaintId)
      
      if (error) {
        throw error
      }
      
      // Update local state
      setComplaints(prev => prev.map(c => 
        c.id === complaintId 
          ? { ...c, status: newStatus, updated_at: new Date().toISOString() }
          : c
      ))
      
      setSuccess(`Complaint status updated to ${newStatus}`)
      
      // Clear success message after 3 seconds
      setTimeout(() => setSuccess(null), 3000)
      
    } catch (error: any) {
      console.error("Status update error:", error)
      setError(error.message || "Failed to update status")
    } finally {
      setLoading(false)
    }
  }

  const handleDeleteComplaint = async (complaintId: string) => {
    if (!confirm("Are you sure you want to delete this complaint? This action cannot be undone.")) {
      return
    }
    
    setLoading(true)
    setError(null)
    setSuccess(null)
    
    try {
      const supabase = createClient()
      
      const { error } = await supabase
        .from("complaints")
        .delete()
        .eq("id", complaintId)
      
      if (error) {
        throw error
      }
      
      // Update local state
      setComplaints(prev => prev.filter(c => c.id !== complaintId))
      setSelectedComplaint(null)
      
      setSuccess("Complaint deleted successfully")
      
      // Clear success message after 3 seconds
      setTimeout(() => setSuccess(null), 3000)
      
    } catch (error: any) {
      console.error("Delete error:", error)
      setError(error.message || "Failed to delete complaint")
    } finally {
      setLoading(false)
    }
  }

  const handleReply = async () => {
    if (!selectedComplaint || !replyMessage.trim()) {
      setError("Please enter a reply message")
      return
    }
    
    setLoading(true)
    setError(null)
    setSuccess(null)
    
    try {
      const supabase = createClient()
      
      // Add reply to database (you'd need to create a replies table for this)
      const { error } = await supabase
        .from("complaint_replies")
        .insert({
          complaint_id: selectedComplaint.id,
          message: replyMessage.trim(),
          admin_id: "current_admin_id", // You'd get this from auth
          created_at: new Date().toISOString()
        })
      
      if (error) {
        throw error
      }
      
      // Update complaint status to in_progress if it was pending
      if (selectedComplaint.status === "pending") {
        await handleStatusUpdate(selectedComplaint.id, "in_progress")
      }
      
      setReplyMessage("")
      setReplyDialogOpen(false)
      setSuccess("Reply sent successfully")
      
      // Clear success message after 3 seconds
      setTimeout(() => setSuccess(null), 3000)
      
    } catch (error: any) {
      console.error("Reply error:", error)
      setError(error.message || "Failed to send reply")
    } finally {
      setLoading(false)
    }
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

  const exportComplaints = () => {
    const csv = [
      ["ID", "Title", "Category", "Status", "Priority", "Location", "User", "Created", "Updated"],
      ...filteredComplaints.map(c => [
        c.id,
        c.title,
        c.category,
        c.status,
        c.priority,
        c.location,
        c.profiles.full_name,
        formatDate(c.created_at),
        formatDate(c.updated_at)
      ])
    ].map(row => row.join(",")).join("\n")
    
    const blob = new Blob([csv], { type: "text/csv" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `complaints_${new Date().toISOString().split('T')[0]}.csv`
    a.click()
    URL.revokeObjectURL(url)
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
          <p className="text-gray-600">Manage and respond to citizen complaints</p>
        </div>
        <Button onClick={exportComplaints} variant="outline">
          <Download className="h-4 w-4 mr-2" />
          Export CSV
        </Button>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total</p>
                <p className="text-2xl font-bold">{stats.total}</p>
              </div>
              <BarChart3 className="h-8 w-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Pending</p>
                <p className="text-2xl font-bold">{stats.pending}</p>
              </div>
              <Clock className="h-8 w-8 text-yellow-500" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">In Progress</p>
                <p className="text-2xl font-bold">{stats.in_progress}</p>
              </div>
              <RefreshCw className="h-8 w-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Resolved</p>
                <p className="text-2xl font-bold">{stats.resolved}</p>
              </div>
              <CheckCircle className="h-8 w-8 text-green-500" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Rejected</p>
                <p className="text-2xl font-bold">{stats.rejected}</p>
              </div>
              <XCircle className="h-8 w-8 text-red-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Alerts */}
      {error && (
        <Alert className="border-red-200 bg-red-50">
          <AlertCircle className="h-4 w-4 text-red-500" />
          <AlertDescription className="text-red-700">
            {error}
          </AlertDescription>
        </Alert>
      )}

      {success && (
        <Alert className="border-green-200 bg-green-50">
          <CheckCircle className="h-4 w-4 text-green-500" />
          <AlertDescription className="text-green-700">
            {success}
          </AlertDescription>
        </Alert>
      )}

      {/* Filters and Search */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
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
            
            <div className="flex items-center space-x-2">
              <Filter className="h-4 w-4 text-gray-500" />
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-32">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="in_progress">In Progress</SelectItem>
                  <SelectItem value="resolved">Resolved</SelectItem>
                  <SelectItem value="rejected">Rejected</SelectItem>
                </SelectContent>
              </Select>
              
              <Select value={priorityFilter} onValueChange={setPriorityFilter}>
                <SelectTrigger className="w-32">
                  <SelectValue placeholder="Priority" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Priority</SelectItem>
                  <SelectItem value="low">Low</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="high">High</SelectItem>
                  <SelectItem value="urgent">Urgent</SelectItem>
                </SelectContent>
              </Select>
              
              <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                <SelectTrigger className="w-32">
                  <SelectValue placeholder="Category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  <SelectItem value="roads">Roads</SelectItem>
                  <SelectItem value="water">Water</SelectItem>
                  <SelectItem value="electricity">Electricity</SelectItem>
                  <SelectItem value="sanitation">Sanitation</SelectItem>
                  <SelectItem value="streetlight">Streetlight</SelectItem>
                  <SelectItem value="drainage">Drainage</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Complaints Table */}
      <Card>
        <CardHeader>
          <CardTitle>Complaints ({filteredComplaints.length})</CardTitle>
        </CardHeader>
        <CardContent>
          {filteredComplaints.length === 0 ? (
            <div className="text-center py-8">
              <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">No complaints found</h3>
              <p className="text-gray-600">
                {searchTerm || statusFilter !== "all" || priorityFilter !== "all" || categoryFilter !== "all"
                  ? "Try adjusting your filters"
                  : "No complaints have been submitted yet"}
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left p-2">Title</th>
                    <th className="text-left p-2">Category</th>
                    <th className="text-left p-2">User</th>
                    <th className="text-left p-2">Status</th>
                    <th className="text-left p-2">Priority</th>
                    <th className="text-left p-2">Created</th>
                    <th className="text-left p-2">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredComplaints.map((complaint) => (
                    <tr key={complaint.id} className="border-b hover:bg-gray-50">
                      <td className="p-2">
                        <div>
                          <div className="font-medium">{complaint.title}</div>
                          <div className="text-sm text-gray-500 truncate max-w-xs">
                            {complaint.description}
                          </div>
                        </div>
                      </td>
                      <td className="p-2">
                        <Badge variant="outline" className="capitalize">
                          {complaint.category}
                        </Badge>
                      </td>
                      <td className="p-2">
                        <div className="flex items-center space-x-2">
                          <User className="h-4 w-4 text-gray-400" />
                          <span className="text-sm">{complaint.profiles.full_name}</span>
                        </div>
                      </td>
                      <td className="p-2">
                        <Badge className={getStatusColor(complaint.status)}>
                          {STATUS_CONFIG[complaint.status as keyof typeof STATUS_CONFIG]?.label || complaint.status}
                        </Badge>
                      </td>
                      <td className="p-2">
                        <Badge className={getPriorityColor(complaint.priority)}>
                          {PRIORITY_CONFIG[complaint.priority as keyof typeof PRIORITY_CONFIG]?.label || complaint.priority}
                        </Badge>
                      </td>
                      <td className="p-2 text-sm text-gray-500">
                        {formatDate(complaint.created_at)}
                      </td>
                      <td className="p-2">
                        <div className="flex items-center space-x-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setSelectedComplaint(complaint)}
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                          
                          <Dialog open={replyDialogOpen} onOpenChange={setReplyDialogOpen}>
                            <DialogTrigger asChild>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => setSelectedComplaint(complaint)}
                              >
                                <MessageSquare className="h-4 w-4" />
                              </Button>
                            </DialogTrigger>
                            <DialogContent>
                              <DialogHeader>
                                <DialogTitle>Reply to Complaint</DialogTitle>
                              </DialogHeader>
                              <div className="space-y-4">
                                <div>
                                  <Label>Complaint</Label>
                                  <div className="p-3 bg-gray-50 rounded">
                                    <p className="font-medium">{selectedComplaint?.title}</p>
                                    <p className="text-sm text-gray-600">{selectedComplaint?.description}</p>
                                  </div>
                                </div>
                                <div>
                                  <Label htmlFor="reply">Your Reply</Label>
                                  <Textarea
                                    id="reply"
                                    placeholder="Enter your response to the citizen..."
                                    value={replyMessage}
                                    onChange={(e) => setReplyMessage(e.target.value)}
                                    rows={4}
                                  />
                                </div>
                                <div className="flex justify-end space-x-2">
                                  <Button variant="outline" onClick={() => setReplyDialogOpen(false)}>
                                    Cancel
                                  </Button>
                                  <Button onClick={handleReply} disabled={loading}>
                                    {loading ? (
                                      <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent mr-2" />
                                    ) : (
                                      <Send className="h-4 w-4 mr-2" />
                                    )}
                                    Send Reply
                                  </Button>
                                </div>
                              </div>
                            </DialogContent>
                          </Dialog>
                          
                          {complaint.status === "pending" && (
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleStatusUpdate(complaint.id, "in_progress")}
                              disabled={loading}
                            >
                              <RefreshCw className="h-4 w-4" />
                            </Button>
                          )}
                          
                          {complaint.status === "in_progress" && (
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleStatusUpdate(complaint.id, "resolved")}
                              disabled={loading}
                            >
                              <CheckCircle className="h-4 w-4" />
                            </Button>
                          )}
                          
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleDeleteComplaint(complaint.id)}
                            disabled={loading}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Complaint Details Modal */}
      {selectedComplaint && (
        <Dialog open={!!selectedComplaint} onOpenChange={() => setSelectedComplaint(null)}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Complaint Details</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Title</Label>
                  <p className="font-medium">{selectedComplaint.title}</p>
                </div>
                <div>
                  <Label>Category</Label>
                  <Badge variant="outline" className="capitalize">
                    {selectedComplaint.category}
                  </Badge>
                </div>
                <div>
                  <Label>Status</Label>
                  <Badge className={getStatusColor(selectedComplaint.status)}>
                    {STATUS_CONFIG[selectedComplaint.status as keyof typeof STATUS_CONFIG]?.label || selectedComplaint.status}
                  </Badge>
                </div>
                <div>
                  <Label>Priority</Label>
                  <Badge className={getPriorityColor(selectedComplaint.priority)}>
                    {PRIORITY_CONFIG[selectedComplaint.priority as keyof typeof PRIORITY_CONFIG]?.label || selectedComplaint.priority}
                  </Badge>
                </div>
              </div>
              
              <div>
                <Label>Description</Label>
                <p className="text-gray-600">{selectedComplaint.description}</p>
              </div>
              
              <div>
                <Label>Location</Label>
                <div className="flex items-center space-x-2">
                  <MapPin className="h-4 w-4 text-gray-400" />
                  <span>{selectedComplaint.location}</span>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Submitted By</Label>
                  <div className="flex items-center space-x-2">
                    <User className="h-4 w-4 text-gray-400" />
                    <span>{selectedComplaint.profiles.full_name}</span>
                  </div>
                </div>
                <div>
                  <Label>Email</Label>
                  <span>{selectedComplaint.profiles.email}</span>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Created</Label>
                  <div className="flex items-center space-x-2">
                    <Calendar className="h-4 w-4 text-gray-400" />
                    <span>{formatDate(selectedComplaint.created_at)}</span>
                  </div>
                </div>
                <div>
                  <Label>Last Updated</Label>
                  <div className="flex items-center space-x-2">
                    <Calendar className="h-4 w-4 text-gray-400" />
                    <span>{formatDate(selectedComplaint.updated_at)}</span>
                  </div>
                </div>
              </div>
              
              {selectedComplaint.images && selectedComplaint.images.length > 0 && (
                <div>
                  <Label>Images</Label>
                  <div className="grid grid-cols-3 gap-2">
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
              
              <div className="flex justify-end space-x-2 pt-4 border-t">
                <Button variant="outline" onClick={() => setSelectedComplaint(null)}>
                  Close
                </Button>
                
                {selectedComplaint.status === "pending" && (
                  <Button
                    onClick={() => {
                      handleStatusUpdate(selectedComplaint.id, "in_progress")
                      setSelectedComplaint(null)
                    }}
                    disabled={loading}
                  >
                    <RefreshCw className="h-4 w-4 mr-2" />
                    Mark In Progress
                  </Button>
                )}
                
                {selectedComplaint.status === "in_progress" && (
                  <Button
                    onClick={() => {
                      handleStatusUpdate(selectedComplaint.id, "resolved")
                      setSelectedComplaint(null)
                    }}
                    disabled={loading}
                  >
                    <CheckCircle className="h-4 w-4 mr-2" />
                    Mark Resolved
                  </Button>
                )}
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  )
}
