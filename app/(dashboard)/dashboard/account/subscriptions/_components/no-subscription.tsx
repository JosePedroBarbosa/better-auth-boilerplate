import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Crown, CheckCircle } from "lucide-react"
import Link from "next/link"

export function NoSubscription() {
  const premiumFeatures = [
    "Unlimited access",
    "Priority support", 
    "Advanced features",
    "No limitations"
  ]

  return (
    <div className="grid gap-6">
      {/* No Subscription Call to Action */}
      <Card className="border-dashed border-2 border-muted-foreground/25">
        <CardContent className="pt-6">
          <div className="text-center space-y-6">
            <div className="mx-auto w-16 h-16 border border-muted-foreground/25 rounded-full flex items-center justify-center">
              <Crown className="h-8 w-8 flex-shrink-0 text-yellow-500" />
            </div>

            <div className="space-y-3">
              <h3 className="text-xl font-bold">Unlock Premium Features</h3>
              <p className="text-muted-foreground max-w-md mx-auto">
                You don&apos;t have an active subscription. Upgrade to Pro
                to access all premium features and unlock your full
                potential.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 justify-center items-center max-w-md mx-auto">
              <Link href="/#pricing" className="w-full sm:w-auto">
                <Button className="w-full sm:w-auto cursor-pointer gap-2">
                  <Crown className="h-4 w-4" />
                  Upgrade to Pro
                </Button>
              </Link>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Features Preview Card */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-3">
            <Crown className="h-5 w-5 flex-shrink-0 text-yellow-500" />
            <div>
              <CardTitle>Premium Features</CardTitle>
              <CardDescription>
                What you&apos;ll get with a Pro subscription
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid sm:grid-cols-2 gap-4">
            {premiumFeatures.map((feature, index) => (
              <div 
                key={index}
                className="flex items-center gap-3 p-3 rounded-lg bg-muted/50"
              >
                <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0" />
                <span className="text-sm font-medium">{feature}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}