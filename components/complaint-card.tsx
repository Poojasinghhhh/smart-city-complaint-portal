import Link from "next/link"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { MapPin, Calendar, Construction, Droplets, Zap, Trash2, Lightbulb, Waves, ChevronRight } from "lucide-react"
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

interface ComplaintCardProps {
  complaint: Complaint
}

export function ComplaintCard({ complaint }: ComplaintCardProps) {
  const CategoryIcon = CATEGORY_ICONS[complaint.category] || Construction
  const statusStyle = STATUS_STYLES[complaint.status] || STATUS_STYLES.pending
  const statusLabel = STATUS_LABELS[complaint.status] || "Unknown"

  return (
    <Link href={`/complaint/${complaint.id}`}>
      <Card className="border-border bg-card hover:border-primary/50 transition-colors cursor-pointer group">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
              <CategoryIcon className="h-5 w-5 text-primary" />
            </div>
            <div>
              <h3 className="font-semibold text-foreground line-clamp-1">{complaint.title}</h3>
              <p className="text-sm text-muted-foreground capitalize">{complaint.category}</p>
            </div>
          </div>
          <Badge variant="outline" className={statusStyle}>
            {statusLabel}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        <p className="text-sm text-muted-foreground line-clamp-2">{complaint.description}</p>
        <div className="flex flex-wrap items-center gap-4 text-xs text-muted-foreground">
          <div className="flex items-center gap-1">
            <MapPin className="h-3 w-3" />
            <span className="line-clamp-1 max-w-[200px]">
              {complaint.address || `${complaint.latitude.toFixed(4)}, ${complaint.longitude.toFixed(4)}`}
            </span>
          </div>
          <div className="flex items-center gap-1">
            <Calendar className="h-3 w-3" />
            <span>{new Date(complaint.created_at).toLocaleDateString()}</span>
          </div>
        </div>
        <div className="pt-2 border-t border-border flex items-center justify-between">
          <span className="text-xs font-mono text-primary">{complaint.ticket_number}</span>
          <ChevronRight className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors" />
        </div>
      </CardContent>
    </Card>
    </Link>
  )
}
