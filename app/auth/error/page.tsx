import Link from "next/link"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { AlertTriangle } from "lucide-react"

export default function AuthErrorPage() {
  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <Card className="w-full max-w-md border-border bg-card text-center">
        <CardHeader className="space-y-4">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-destructive/20">
            <AlertTriangle className="h-7 w-7 text-destructive" />
          </div>
          <div>
            <CardTitle className="text-2xl font-bold text-foreground">Authentication Error</CardTitle>
            <CardDescription className="text-muted-foreground mt-2">
              There was a problem verifying your account. The link may have expired or already been used.
            </CardDescription>
          </div>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            Please try signing up again or contact support if the problem persists.
          </p>
        </CardContent>
        <CardFooter className="flex flex-col gap-2">
          <Button asChild className="w-full">
            <Link href="/auth/sign-up">Try Again</Link>
          </Button>
          <Button asChild variant="outline" className="w-full">
            <Link href="/auth/login">Return to Sign In</Link>
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}
