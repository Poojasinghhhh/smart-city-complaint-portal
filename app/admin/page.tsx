import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import AdminDashboardEnhanced from "@/components/admin-dashboard-enhanced"

export default async function AdminPage() {
  const supabase = await createClient()

  // Check if user is authenticated and is admin
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) {
    redirect("/auth/login")
  }

  // Get user profile to check role
  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single()

  if (!profile || profile.role !== "admin") {
    redirect("/dashboard")
  }

  // Fetch all complaints for admin view
  const { data: complaints, error: complaintsError } = await supabase
    .from("complaints")
    .select(`
      *,
      profiles (
        full_name,
        email
      )
    `)
    .order("created_at", { ascending: false })

  if (complaintsError) {
    console.error("Error fetching complaints:", complaintsError)
  }

  const adminComplaints = (complaints || []) as any[]

  return (
    <div className="container mx-auto p-6">
      <AdminDashboardEnhanced complaints={adminComplaints} />
    </div>
  )
}
