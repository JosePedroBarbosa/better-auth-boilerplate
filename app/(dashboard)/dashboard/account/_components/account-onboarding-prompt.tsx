import {
  Card,
  CardContent,
} from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Settings, UserX } from "lucide-react"
import Link from "next/link"

export function AccountOnboardingPrompt() {
  return (
    <Card className="border-dashed border-2 border-muted-foreground/25">
      <CardContent className="pt-6">
        <div className="text-center space-y-4">
          <div className="mx-auto w-12 h-12 bg-muted rounded-full flex items-center justify-center">
            <UserX className="h-6 w-6 text-muted-foreground" />
          </div>
          
          <div className="space-y-2">
            <h3 className="font-semibold">Complete Your Profile Setup</h3>
            <p className="text-sm text-muted-foreground max-w-md mx-auto">
              Finish setting up your account to access all features and personalize your experience.
            </p>
          </div>
          
          <Link href="/onboarding">
            <Button className="mt-4 cursor-pointer">
              <Settings className="h-4 w-4 mr-2" />
              Complete Setup
            </Button>
          </Link>
        </div>
      </CardContent>
    </Card>
  )
}