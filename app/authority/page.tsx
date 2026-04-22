import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { Header } from "@/components/header"
import { AuthorityComplaintTable } from "@/components/authority-complaint-table"
import { AnalyticsCharts } from "@/components/analytics-charts"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent } from "@/components/ui/card"
import { 
  ClipboardList, 
  Clock, 
  CheckCircle, 
  XCircle,
  AlertTriangle,
  BarChart3,
  TableIcon
} from "lucide-react"
import type { Complaint, Profile } from "@/lib/types"

export default async function AuthorityDashboardPage() {
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

  // Check if user is authority or admin
  if (!profile || (profile.role !== "authority" && profile.role !== "admin")) {
    redirect("/dashboard")
  }

  // Fetch all complaints for authorities
  const { data: complaints } = await supabase
    .from("complaints")
    .select("*")
    .order("created_at", { ascending: false })

  const allComplaints = (complaints || []) as Complaint[]
  const stats = {
    total: allComplaints.length,
    pending: allComplaints.filter(c => c.status === "pending").length,
    inProgress: allComplaints.filter(c => c.status === "in_progress").length,
    resolved: allComplaints.filter(c => c.status === "resolved").length,
    rejected: allComplaints.filter(c => c.status === "rejected").length,
  }

  return (
    <div className="min-h-screen">
      <Header profile={profile as Profile} />
      
      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-foreground">Authority Dashboard</h1>
          <p className="text-muted-foreground mt-1">Manage and resolve citizen complaints</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 mb-8">
          <Card className="border-border bg-card">
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                  <ClipboardList className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-foreground">{stats.total}</p>
                  <p className="text-xs text-muted-foreground">Total</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="border-border bg-card">
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-status-pending/10">
                  <AlertTriangle className="h-5 w-5 text-status-pending" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-foreground">{stats.pending}</p>
                  <p className="text-xs text-muted-foreground">Pending</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="border-border bg-card">
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-status-in-progress/10">
                  <Clock className="h-5 w-5 text-status-in-progress" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-foreground">{stats.inProgress}</p>
                  <p className="text-xs text-muted-foreground">In Progress</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="border-border bg-card">
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-status-resolved/10">
                  <CheckCircle className="h-5 w-5 text-status-resolved" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-foreground">{stats.resolved}</p>
                  <p className="text-xs text-muted-foreground">Resolved</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="border-border bg-card">
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-status-rejected/10">
                  <XCircle className="h-5 w-5 text-status-rejected" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-foreground">{stats.rejected}</p>
                  <p className="text-xs text-muted-foreground">Rejected</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Tabs for Table and Analytics */}
        <Tabs defaultValue="complaints" className="space-y-6">
          <TabsList className="bg-secondary">
            <TabsTrigger value="complaints" className="gap-2">
              <TableIcon className="h-4 w-4" />
              All Complaints
            </TabsTrigger>
            <TabsTrigger value="analytics" className="gap-2">
              <BarChart3 className="h-4 w-4" />
              Analytics
            </TabsTrigger>
          </TabsList>

          <TabsContent value="complaints">
            <AuthorityComplaintTable complaints={allComplaints} />
          </TabsContent>

          <TabsContent value="analytics">
            <AnalyticsCharts complaints={allComplaints} />
          </TabsContent>
        </Tabs>
      </main>
    </div>
  )
}
