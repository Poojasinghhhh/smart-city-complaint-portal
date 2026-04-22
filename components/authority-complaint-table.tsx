"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table"
import { UpdateStatusDialog } from "@/components/update-status-dialog"
import { 
  Search, 
  Filter,
  MapPin,
  Construction,
  Droplets,
  Zap,
  Trash2,
  Lightbulb,
  Waves,
  Eye
} from "lucide-react"
import type { Complaint } from "@/lib/types"

const CATEGORY_ICONS: Record<string, typeof Construction> = {
  roads: Construction,
  water: Droplets,
  electricity: Zap,
  sanitation: Trash2,
  streetlights: Lightbulb,
  drainage: Waves,
}

const STATUS_STYLES: Record<string, string> = {
  pending: "bg-status-pending/20 text-status-pending border-status-pending/30",
  in_progress: "bg-status-in-progress/20 text-status-in-progress border-status-in-progress/30",
  resolved: "bg-status-resolved/20 text-status-resolved border-status-resolved/30",
  rejected: "bg-status-rejected/20 text-status-rejected border-status-rejected/30",
}

const STATUS_LABELS: Record<string, string> = {
  pending: "Pending",
  in_progress: "In Progress",
  resolved: "Resolved",
  rejected: "Rejected",
}

const PRIORITY_STYLES: Record<string, string> = {
  low: "bg-muted text-muted-foreground",
  medium: "bg-status-pending/20 text-status-pending",
  high: "bg-destructive/20 text-destructive",
  urgent: "bg-destructive text-destructive-foreground",
}

interface AuthorityComplaintTableProps {
  complaints: Complaint[]
}

export function AuthorityComplaintTable({ complaints }: AuthorityComplaintTableProps) {
  const [search, setSearch] = useState("")
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [categoryFilter, setCategoryFilter] = useState<string>("all")
  const [selectedComplaint, setSelectedComplaint] = useState<Complaint | null>(null)

  const filteredComplaints = complaints.filter((c) => {
    const matchesSearch = 
      c.title.toLowerCase().includes(search.toLowerCase()) ||
      c.ticket_number.toLowerCase().includes(search.toLowerCase()) ||
      c.description.toLowerCase().includes(search.toLowerCase())
    
    const matchesStatus = statusFilter === "all" || c.status === statusFilter
    const matchesCategory = categoryFilter === "all" || c.category === categoryFilter
    
    return matchesSearch && matchesStatus && matchesCategory
  })

  return (
    <>
      <Card className="border-border bg-card">
        <CardHeader className="pb-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <CardTitle className="text-foreground">All Complaints</CardTitle>
            <div className="flex flex-col sm:flex-row gap-2">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search tickets..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="pl-10 w-full sm:w-64 bg-input border-border"
                />
              </div>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-full sm:w-36 bg-input border-border">
                  <Filter className="h-4 w-4 mr-2" />
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
              <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                <SelectTrigger className="w-full sm:w-36 bg-input border-border">
                  <SelectValue placeholder="Category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  <SelectItem value="roads">Roads</SelectItem>
                  <SelectItem value="water">Water</SelectItem>
                  <SelectItem value="electricity">Electricity</SelectItem>
                  <SelectItem value="sanitation">Sanitation</SelectItem>
                  <SelectItem value="streetlights">Streetlights</SelectItem>
                  <SelectItem value="drainage">Drainage</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="border-border hover:bg-transparent">
                  <TableHead className="text-muted-foreground">Ticket</TableHead>
                  <TableHead className="text-muted-foreground">Category</TableHead>
                  <TableHead className="text-muted-foreground">Subject</TableHead>
                  <TableHead className="text-muted-foreground">Location</TableHead>
                  <TableHead className="text-muted-foreground">Priority</TableHead>
                  <TableHead className="text-muted-foreground">Status</TableHead>
                  <TableHead className="text-muted-foreground">Date</TableHead>
                  <TableHead className="text-muted-foreground text-right">Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredComplaints.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={8} className="text-center py-12 text-muted-foreground">
                      No complaints found matching your criteria
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredComplaints.map((complaint) => {
                    const CategoryIcon = CATEGORY_ICONS[complaint.category] || Construction
                    return (
                      <TableRow key={complaint.id} className="border-border">
                        <TableCell className="font-mono text-sm text-primary">
                          {complaint.ticket_number}
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <CategoryIcon className="h-4 w-4 text-primary" />
                            <span className="capitalize text-foreground">{complaint.category}</span>
                          </div>
                        </TableCell>
                        <TableCell className="max-w-48">
                          <span className="text-foreground line-clamp-1">{complaint.title}</span>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-1 text-muted-foreground">
                            <MapPin className="h-3 w-3" />
                            <span className="text-xs line-clamp-1 max-w-24">
                              {complaint.address?.split(",")[0] || `${complaint.latitude.toFixed(2)}, ${complaint.longitude.toFixed(2)}`}
                            </span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline" className={PRIORITY_STYLES[complaint.priority || "medium"]}>
                            {complaint.priority || "medium"}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline" className={STATUS_STYLES[complaint.status]}>
                            {STATUS_LABELS[complaint.status]}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-muted-foreground text-sm">
                          {new Date(complaint.created_at).toLocaleDateString()}
                        </TableCell>
                        <TableCell className="text-right">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setSelectedComplaint(complaint)}
                            className="gap-2"
                          >
                            <Eye className="h-4 w-4" />
                            View
                          </Button>
                        </TableCell>
                      </TableRow>
                    )
                  })
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {selectedComplaint && (
        <UpdateStatusDialog
          complaint={selectedComplaint}
          open={!!selectedComplaint}
          onOpenChange={(open) => !open && setSelectedComplaint(null)}
        />
      )}
    </>
  )
}
