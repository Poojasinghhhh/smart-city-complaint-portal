"use client"

import Link from "next/link"
import { useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Building2, LogOut, LayoutDashboard, Shield } from "lucide-react"
import type { Profile } from "@/lib/types"

interface HeaderProps {
  profile: Profile | null
}

export function Header({ profile }: HeaderProps) {
  const router = useRouter()

  const handleSignOut = async () => {
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push("/")
    router.refresh()
  }

  return (
    <header className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-50">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-3 hover:opacity-80 transition-opacity">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary">
            <Building2 className="h-5 w-5 text-primary-foreground" />
          </div>
          <span className="font-semibold text-foreground hidden sm:block">Smart City</span>
        </Link>

        {profile ? (
          <div className="flex items-center gap-3">
            <span className="text-sm text-muted-foreground hidden md:block">
              {profile.full_name || "User"}
            </span>
            {profile.role === "authority" || profile.role === "admin" ? (
              <Button asChild variant="outline" size="sm" className="gap-2">
                <Link href="/authority">
                  <Shield className="h-4 w-4" />
                  <span className="hidden sm:inline">Authority Dashboard</span>
                </Link>
              </Button>
            ) : (
              <Button asChild variant="outline" size="sm" className="gap-2">
                <Link href="/dashboard">
                  <LayoutDashboard className="h-4 w-4" />
                  <span className="hidden sm:inline">Dashboard</span>
                </Link>
              </Button>
            )}
            <Button variant="ghost" size="icon" onClick={handleSignOut} title="Sign Out">
              <LogOut className="h-4 w-4" />
            </Button>
          </div>
        ) : (
          <div className="flex items-center gap-2">
            <Button asChild variant="ghost" size="sm">
              <Link href="/auth/login">Sign In</Link>
            </Button>
            <Button asChild size="sm">
              <Link href="/auth/sign-up">Register</Link>
            </Button>
          </div>
        )}
      </div>
    </header>
  )
}
