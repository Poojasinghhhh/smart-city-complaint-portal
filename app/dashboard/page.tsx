import { redirect } from "next/navigation"
import Link from "next/link"
import { createClient } from "@/lib/supabase/server"
import { Header } from "@/components/header"
import { ComplaintForm } from "@/components/complaint-form"
import { ComplaintCard } from "@/components/complaint-card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { PlusCircle, ClipboardList, CheckCircle } from "lucide-react"
import type { Complaint, Profile } from "@/lib/types"

export default async function DashboardPage({
  searchParams,
}: {
  searchParams: Promise<{ submitted?: string }>
}) {
  const params = await searchParams
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

  const { data: complaints, error: complaintsError } = await supabase
    .from("complaints")
    .select("*")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false })

  console.log("Dashboard - User ID:", user.id)
  console.log("Dashboard - Complaints data:", complaints)
  console.log("Dashboard - Complaints error:", complaintsError)

  const myComplaints = (complaints || []) as Complaint[]
  const pendingCount = myComplaints.filter(c => c.status === "pending").length
  const resolvedCount = myComplaints.filter(c => c.status === "resolved").length

  return (
    <div className="min-h-screen">
      <Header profile={profile as Profile} />
      
      <main className="container mx-auto px-4 py-8">
        {params.submitted && (
          <div className="mb-6 flex items-center gap-2 rounded-lg bg-status-resolved/10 border border-status-resolved/30 p-4 text-status-resolved">
            <CheckCircle className="h-5 w-5" />
            <span>Your complaint has been submitted successfully. Check the console for email notification details.</span>
          </div>
        )}

        <div className="mb-8">
          <h1 className="text-2xl font-bold text-foreground">Citizen Dashboard</h1>
          <p className="text-muted-foreground mt-1">Register and track your civic complaints</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <Card className="border-border bg-card">
            <CardContent className="pt-6">
              <div className="flex items-center gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                  <ClipboardList className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-foreground">{myComplaints.length}</p>
                  <p className="text-sm text-muted-foreground">Total Complaints</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="border-border bg-card">
            <CardContent className="pt-6">
              <div className="flex items-center gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-status-pending/10">
                  <PlusCircle className="h-6 w-6 text-status-pending" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-foreground">{pendingCount}</p>
                  <p className="text-sm text-muted-foreground">Pending</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="border-border bg-card">
            <CardContent className="pt-6">
              <div className="flex items-center gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-status-resolved/10">
                  <CheckCircle className="h-6 w-6 text-status-resolved" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-foreground">{resolvedCount}</p>
                  <p className="text-sm text-muted-foreground">Resolved</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Link
            href="/public-complaints"
            className="border border-border bg-card cursor-pointer hover:bg-orange-50 transition-colors rounded-lg p-6"
          >
            <div className="flex items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-orange-100">
                <PlusCircle className="h-6 w-6 text-orange-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">75</p>
                <p className="text-sm text-muted-foreground">Public Complaints</p>
              </div>
            </div>
          </Link>
        </div>

        {/* Tabs */}
        <Tabs defaultValue="new" className="space-y-6">
          <TabsList className="bg-secondary">
            <TabsTrigger value="new" className="gap-2">
              <PlusCircle className="h-4 w-4" />
              New Complaint
            </TabsTrigger>
            <TabsTrigger value="my-complaints" className="gap-2">
              <ClipboardList className="h-4 w-4" />
              My Complaints ({myComplaints.length})
            </TabsTrigger>
          </TabsList>

          <TabsContent value="new">
            <div className="max-w-2xl">
              <ComplaintForm userId={user.id} />
            </div>
          </TabsContent>

          <TabsContent value="my-complaints">
            {myComplaints.length === 0 ? (
              <Card className="border-border bg-card">
                <CardHeader className="text-center py-12">
                  <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-muted mb-4">
                    <ClipboardList className="h-8 w-8 text-muted-foreground" />
                  </div>
                  <CardTitle className="text-foreground">No Complaints Yet</CardTitle>
                  <CardDescription className="text-muted-foreground">
                    You have not registered any complaints. Click on New Complaint tab to submit one.
                  </CardDescription>
                </CardHeader>
              </Card>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {myComplaints.map((complaint) => (
                  <ComplaintCard key={complaint.id} complaint={complaint} />
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </main>
    </div>
  )
}
