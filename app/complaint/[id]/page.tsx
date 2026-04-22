import { redirect, notFound } from "next/navigation"
import Link from "next/link"
import { createClient } from "@/lib/supabase/server"
import { Header } from "@/components/header"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { 
  ArrowLeft,
  MapPin,
  Calendar,
  Construction,
  Droplets,
  Zap,
  Trash2,
  Lightbulb,
  Waves,
  ExternalLink,
  Clock,
  MessageSquare
} from "lucide-react"
import type { Complaint, ComplaintUpdate, Profile } from "@/lib/types"

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

export default async function ComplaintDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const supabase = await createClient()
  
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) {
    redirect("/auth/login")
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .single()

  const { data: complaint } = await supabase
    .from("complaints")
    .select("*")
    .eq("id", id)
    .single()

  if (!complaint) {
    notFound()
  }

  // Verify ownership (unless authority)
  const isAuthority = profile?.role === "authority" || profile?.role === "admin"
  if (complaint.user_id !== user.id && !isAuthority) {
    redirect("/dashboard")
  }

  // Fetch updates
  const { data: updates } = await supabase
    .from("complaint_updates")
    .select("*")
    .eq("complaint_id", id)
    .order("created_at", { ascending: false })

  const complaintData = complaint as Complaint
  const updatesData = (updates || []) as ComplaintUpdate[]
  const CategoryIcon = CATEGORY_ICONS[complaintData.category] || Construction

  return (
    <div className="min-h-screen">
      <Header profile={profile as Profile} />
      
      <main className="container mx-auto px-4 py-8">
        <Button asChild variant="ghost" className="mb-6 -ml-2 gap-2">
          <Link href={isAuthority ? "/authority" : "/dashboard"}>
            <ArrowLeft className="h-4 w-4" />
            Back to Dashboard
          </Link>
        </Button>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Complaint Details */}
          <div className="lg:col-span-2 space-y-6">
            <Card className="border-border bg-card">
              <CardHeader>
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-center gap-4">
                    <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                      <CategoryIcon className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <CardTitle className="text-foreground">{complaintData.title}</CardTitle>
                      <CardDescription className="text-primary font-mono">
                        {complaintData.ticket_number}
                      </CardDescription>
                    </div>
                  </div>
                  <Badge variant="outline" className={STATUS_STYLES[complaintData.status]}>
                    {STATUS_LABELS[complaintData.status]}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground mb-2">Description</h3>
                  <p className="text-foreground">{complaintData.description}</p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <h3 className="text-sm font-medium text-muted-foreground mb-2">Category</h3>
                    <p className="text-foreground capitalize">{complaintData.category}</p>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-muted-foreground mb-2">Priority</h3>
                    <p className="text-foreground capitalize">{complaintData.priority || "Medium"}</p>
                  </div>
                </div>

                <div>
                  <h3 className="text-sm font-medium text-muted-foreground mb-2">Location</h3>
                  <a
                    href={`https://www.google.com/maps?q=${complaintData.latitude},${complaintData.longitude}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 text-primary hover:underline"
                  >
                    <MapPin className="h-4 w-4" />
                    {complaintData.address || `${complaintData.latitude.toFixed(6)}, ${complaintData.longitude.toFixed(6)}`}
                    <ExternalLink className="h-3 w-3" />
                  </a>
                </div>

                <div className="flex items-center gap-4 text-sm text-muted-foreground pt-4 border-t border-border">
                  <div className="flex items-center gap-1">
                    <Calendar className="h-4 w-4" />
                    <span>Created: {new Date(complaintData.created_at).toLocaleDateString()}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Clock className="h-4 w-4" />
                    <span>Updated: {new Date(complaintData.updated_at).toLocaleDateString()}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Status Timeline */}
          <div className="lg:col-span-1">
            <Card className="border-border bg-card">
              <CardHeader>
                <CardTitle className="text-foreground text-base flex items-center gap-2">
                  <MessageSquare className="h-4 w-4" />
                  Status Updates
                </CardTitle>
              </CardHeader>
              <CardContent>
                {updatesData.length === 0 ? (
                  <p className="text-sm text-muted-foreground text-center py-4">
                    No updates yet. You will see status changes here.
                  </p>
                ) : (
                  <div className="space-y-4">
                    {updatesData.map((update, index) => (
                      <div key={update.id} className="relative pl-6">
                        {index < updatesData.length - 1 && (
                          <div className="absolute left-2 top-6 bottom-0 w-px bg-border" />
                        )}
                        <div className="absolute left-0 top-1 w-4 h-4 rounded-full bg-primary/20 border-2 border-primary" />
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <Badge variant="outline" className={STATUS_STYLES[update.new_status]} size="sm">
                              {STATUS_LABELS[update.new_status]}
                            </Badge>
                          </div>
                          {update.comment && (
                            <p className="text-sm text-foreground">{update.comment}</p>
                          )}
                          <p className="text-xs text-muted-foreground">
                            {new Date(update.created_at).toLocaleString()}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  )
}
