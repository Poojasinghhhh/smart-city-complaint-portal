"use client"

import { useState } from "react"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { CheckCircle, XCircle, Clock, AlertCircle } from "lucide-react"

interface Complaint {
  id: string
  title: string
  description: string
  category: string
  status: string
  priority: string
  created_at: string
  profiles?: {
    full_name: string
    email: string
  }
}

interface AdminDashboardProps {
  complaints: Complaint[]
}

export function AdminDashboard({ complaints }: AdminDashboardProps) {
  const [complaintsList, setComplaintsList] = useState<Complaint[]>(complaints)
  const [loading, setLoading] = useState<string | null>(null)

  const updateComplaintStatus = async (complaintId: string, newStatus: string) => {
    setLoading(complaintId)
    const supabase = createClient()

    try {
      const { error } = await supabase
        .from("complaints")
        .update({ 
          status: newStatus,
          updated_at: new Date().toISOString(),
          resolved_at: newStatus === 'resolved' ? new Date().toISOString() : null
        })
        .eq("id", complaintId)

      if (error) {
        console.error("Error updating complaint:", error)
        return
      }

      // Update local state
      setComplaintsList(prev => 
        prev.map(c => 
          c.id === complaintId 
            ? { ...c, status: newStatus, updated_at: new Date().toISOString() }
            : c
        )
      )

      console.log(`Complaint ${complaintId} updated to ${newStatus}`)
    } catch (error) {
      console.error("Unexpected error:", error)
    } finally {
      setLoading(null)
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending':
        return <Clock className="h-4 w-4" />
      case 'in_progress':
        return <AlertCircle className="h-4 w-4" />
      case 'resolved':
        return <CheckCircle className="h-4 w-4" />
      case 'rejected':
        return <XCircle className="h-4 w-4" />
      default:
        return <Clock className="h-4 w-4" />
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return "bg-yellow-100 text-yellow-800 border-yellow-200"
      case 'in_progress':
        return "bg-blue-100 text-blue-800 border-blue-200"
      case 'resolved':
        return "bg-green-100 text-green-800 border-green-200"
      case 'rejected':
        return "bg-red-100 text-red-800 border-red-200"
      default:
        return "bg-gray-100 text-gray-800 border-gray-200"
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'urgent':
        return "bg-red-100 text-red-800"
      case 'high':
        return "bg-orange-100 text-orange-800"
      case 'medium':
        return "bg-yellow-100 text-yellow-800"
      case 'low':
        return "bg-gray-100 text-gray-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Admin Dashboard</h1>
        <div className="text-sm text-muted-foreground">
          Total Complaints: {complaintsList.length}
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Clock className="h-5 w-5 text-yellow-600" />
              <div>
                <h3 className="text-lg font-semibold">Pending</h3>
                <p className="text-2xl font-bold">
                  {complaintsList.filter(c => c.status === 'pending').length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <AlertCircle className="h-5 w-5 text-blue-600" />
              <div>
                <h3 className="text-lg font-semibold">In Progress</h3>
                <p className="text-2xl font-bold">
                  {complaintsList.filter(c => c.status === 'in_progress').length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <CheckCircle className="h-5 w-5 text-green-600" />
              <div>
                <h3 className="text-lg font-semibold">Resolved</h3>
                <p className="text-2xl font-bold">
                  {complaintsList.filter(c => c.status === 'resolved').length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <XCircle className="h-5 w-5 text-red-600" />
              <div>
                <h3 className="text-lg font-semibold">Rejected</h3>
                <p className="text-2xl font-bold">
                  {complaintsList.filter(c => c.status === 'rejected').length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Complaints List */}
      <Card>
        <CardHeader>
          <CardTitle>All Complaints</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {complaintsList.map((complaint) => (
              <ComplaintRow 
                key={complaint.id} 
                complaint={complaint}
                onUpdateStatus={updateComplaintStatus}
                loading={loading === complaint.id}
                getStatusIcon={getStatusIcon}
                getStatusColor={getStatusColor}
                getPriorityColor={getPriorityColor}
              />
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

interface ComplaintRowProps {
  complaint: Complaint
  onUpdateStatus: (id: string, status: string) => void
  loading: boolean
  getStatusIcon: (status: string) => React.ReactNode
  getStatusColor: (status: string) => string
  getPriorityColor: (priority: string) => string
}

function ComplaintRow({ 
  complaint, 
  onUpdateStatus, 
  loading,
  getStatusIcon,
  getStatusColor,
  getPriorityColor
}: ComplaintRowProps) {
  return (
    <div className="border rounded-lg p-4 hover:bg-muted/50 transition-colors">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-2">
            <h3 className="font-semibold text-lg">{complaint.title}</h3>
            <Badge className={`${getStatusColor(complaint.status)} border`}>
              <div className="flex items-center gap-1">
                {getStatusIcon(complaint.status)}
                {complaint.status.replace('_', ' ')}
              </div>
            </Badge>
            <Badge className={getPriorityColor(complaint.priority)}>
              {complaint.priority}
            </Badge>
            <span className="text-sm text-muted-foreground capitalize">
              {complaint.category}
            </span>
          </div>
          
          <p className="text-muted-foreground mb-3">
            {complaint.description}
          </p>
          
          <div className="flex items-center gap-4 text-sm text-muted-foreground">
            <span>
              <strong>By:</strong> {complaint.profiles?.full_name || 'Unknown'}
            </span>
            <span>
              <strong>Email:</strong> {complaint.profiles?.email || 'N/A'}
            </span>
            <span>
              <strong>ID:</strong> {complaint.id.substring(0, 8)}...
            </span>
            <span>
              <strong>Submitted:</strong> {new Date(complaint.created_at).toLocaleDateString()}
            </span>
          </div>
        </div>
        
        <div className="flex items-center gap-2 ml-4">
          <ComplaintActions 
            complaint={complaint}
            onUpdateStatus={onUpdateStatus}
            loading={loading}
          />
        </div>
      </div>
    </div>
  )
}

interface ComplaintActionsProps {
  complaint: Complaint
  onUpdateStatus: (id: string, status: string) => void
  loading: boolean
}

function ComplaintActions({ complaint, onUpdateStatus, loading }: ComplaintActionsProps) {
  if (loading) {
    return <div className="text-sm text-muted-foreground">Updating...</div>
  }

  return (
    <div className="flex flex-col gap-2">
      {complaint.status === 'pending' && (
        <>
          <Button 
            size="sm" 
            onClick={() => onUpdateStatus(complaint.id, 'in_progress')}
            className="bg-blue-500 hover:bg-blue-600"
          >
            Start Work
          </Button>
          <Button 
            size="sm" 
            variant="destructive"
            onClick={() => onUpdateStatus(complaint.id, 'rejected')}
          >
            Reject
          </Button>
        </>
      )}
      
      {complaint.status === 'in_progress' && (
        <>
          <Button 
            size="sm" 
            onClick={() => onUpdateStatus(complaint.id, 'resolved')}
            className="bg-green-500 hover:bg-green-600"
          >
            Resolve
          </Button>
          <Button 
            size="sm" 
            variant="destructive"
            onClick={() => onUpdateStatus(complaint.id, 'rejected')}
          >
            Reject
          </Button>
        </>
      )}
      
      {complaint.status === 'resolved' && (
        <div className="text-sm text-green-600 font-medium text-center">
          <CheckCircle className="h-4 w-4 mx-auto mb-1" />
          Completed
        </div>
      )}
      
      {complaint.status === 'rejected' && (
        <div className="text-sm text-red-600 font-medium text-center">
          <XCircle className="h-4 w-4 mx-auto mb-1" />
          Rejected
        </div>
      )}
    </div>
  )
}
