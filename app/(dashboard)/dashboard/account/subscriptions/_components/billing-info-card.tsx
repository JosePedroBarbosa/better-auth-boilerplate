import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { 
  DollarSign,
  CheckCircle,
  Clock,
  Settings,
  CreditCard,
} from "lucide-react"
import { Subscription } from "@better-auth/stripe"
import { formatDate, formatRelativeDate } from "@/lib/utils"

interface BillingInfoCardProps {
  subscription: Subscription
  billingPortalUrl: string
}

export function BillingInfoCard({ subscription, billingPortalUrl }: BillingInfoCardProps) {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-3">
          <DollarSign className="h-5 w-5 flex-shrink-0" />
          <div>
            <CardTitle>Billing Info</CardTitle>
            <CardDescription>Payment and billing details</CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Status Overview */}
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-sm font-medium">
            <CheckCircle
              className={`h-4 w-4 ${
                subscription.status === "active" 
                  ? "text-green-600" 
                  : "text-yellow-600"
              }`}
            />
            Status
          </div>
          <div className="pl-6">
            <p
              className={`text-sm font-medium ${
                subscription.status === "active"
                  ? "text-green-600"
                  : "text-yellow-600"
              }`}
            >
              {subscription.status === "active"
                ? "Up to date"
                : "Attention required"}
            </p>
          </div>
        </div>

        <Separator />

        {/* Next Billing */}
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-sm font-medium">
            <Clock className="h-4 w-4 text-muted-foreground" />
            Next Billing Date
          </div>
          <div className="pl-6 space-y-1">
            <p className="text-sm text-muted-foreground">
              {subscription.periodEnd
                ? formatDate(subscription.periodEnd)
                : "No end date"}
            </p>
            {subscription.periodEnd && (
              <p className="text-xs text-muted-foreground">
                {formatRelativeDate(subscription.periodEnd)}
              </p>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}