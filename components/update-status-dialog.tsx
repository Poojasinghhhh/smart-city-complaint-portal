"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Field, FieldLabel } from "@/components/ui/field"
import { 
  MapPin, 
  Calendar, 
  Construction, 
  Droplets, 
  Zap, 
  Trash2, 
  Lightbulb, 
  Waves,
  ExternalLink,
  Loader2
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

interface UpdateStatusDialogProps {
  complaint: Complaint
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function UpdateStatusDialog({ complaint, open, onOpenChange }: UpdateStatusDialogProps) {
  const [newStatus, setNewStatus] = useState(complaint.status)
  const [priority, setPriority] = useState(complaint.priority || "medium")
  const [comment, setComment] = useState("")
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const CategoryIcon = CATEGORY_ICONS[complaint.category] || Construction

  const handleUpdate = async () => {
    setLoading(true)
    const supabase = createClient()
    
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return

    // Update complaint status
    await supabase
      .from("complaints")
      .update({ 
        status: newStatus,
        priority,
        updated_at: new Date().toISOString()
      })
      .eq("id", complaint.id)

    // Add update log if status changed or comment provided
    if (newStatus !== complaint.status || comment.trim()) {
      await supabase
        .from("complaint_updates")
        .insert({
          complaint_id: complaint.id,
          user_id: user.id,
          old_status: complaint.status,
          new_status: newStatus,
          comment: comment.trim() || null,
        })
    }

    setLoading(false)
    onOpenChange(false)
    router.refresh()
  }

  const openInMaps = () => {
    window.open(
      `https://www.google.com/maps?q=${complaint.latitude},${complaint.longitude}`,
      "_blank"
    )
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg bg-card border-border">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-3 text-foreground">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
              <CategoryIcon className="h-5 w-5 text-primary" />
            </div>
            <div>
              <span className="block">{complaint.title}</span>
              <span className="text-sm font-mono text-primary font-normal">{complaint.ticket_number}</span>
            </div>
          </DialogTitle>
          <DialogDescription className="text-muted-foreground sr-only">
            View and update complaint details
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* Complaint Details */}
          <div className="p-4 rounded-lg bg-secondary/50 space-y-3">
            <p className="text-sm text-foreground">{complaint.description}</p>
            <div className="flex flex-wrap gap-4 text-xs text-muted-foreground">
              <button 
                onClick={openInMaps}
                className="flex items-center gap-1 hover:text-primary transition-colors"
              >
                <MapPin className="h-3 w-3" />
                <span className="line-clamp-1 max-w-[200px]">{complaint.address || "View on map"}</span>
                <ExternalLink className="h-3 w-3" />
              </button>
              <div className="flex items-center gap-1">
                <Calendar className="h-3 w-3" />
                <span>{new Date(complaint.created_at).toLocaleDateString()}</span>
              </div>
            </div>
          </div>

          {/* Current Status */}
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground">Current Status:</span>
            <Badge variant="outline" className={STATUS_STYLES[complaint.status]}>
              {complaint.status.replace("_", " ")}
            </Badge>
          </div>

          {/* Update Form */}
          <div className="space-y-4">
            <Field>
              <FieldLabel>Update Status</FieldLabel>
              <Select value={newStatus} onValueChange={setNewStatus}>
                <SelectTrigger className="bg-input border-border">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="in_progress">In Progress</SelectItem>
                  <SelectItem value="resolved">Resolved</SelectItem>
                  <SelectItem value="rejected">Rejected</SelectItem>
                </SelectContent>
              </Select>
            </Field>

            <Field>
              <FieldLabel>Priority</FieldLabel>
              <Select value={priority} onValueChange={setPriority}>
                <SelectTrigger className="bg-input border-border">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="low">Low</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="high">High</SelectItem>
                  <SelectItem value="urgent">Urgent</SelectItem>
                </SelectContent>
              </Select>
            </Field>

            <Field>
              <FieldLabel>Add Comment (Optional)</FieldLabel>
              <Textarea
                placeholder="Add a note about this update..."
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                className="bg-input border-border min-h-20"
              />
            </Field>
          </div>
        </div>

        <DialogFooter className="gap-2">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleUpdate} disabled={loading}>
            {loading ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Updating...
              </>
            ) : (
              "Update Complaint"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
