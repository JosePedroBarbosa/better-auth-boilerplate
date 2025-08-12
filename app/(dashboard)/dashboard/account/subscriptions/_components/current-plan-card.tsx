import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import { 
  Crown, 
  Settings, 
  RefreshCw, 
  AlertTriangle, 
  Users,
  Calendar,
  Package,
  Star,
  Zap,
} from "lucide-react"
import Link from "next/link"
import { Subscription } from "@better-auth/stripe"
import { StatusBadge } from "./status-badge"
import { SubscriptionInfoItem } from "./subscription-info-item"
import { formatDate } from "@/lib/utils"
import { CancelSubscriptionButton } from "./cancel-subscription-button"
import { RestoreSubscriptionButton } from "./restore-subscription-button"

interface CurrentPlanCardProps {
  subscription: Subscription
  billingPortalUrl: string
}

const PLAN_FEATURES = {
  basic: {
    projects: 5,
    storage: 10,
    color: "from-blue-500 to-blue-600",
    icon: Package
  },
  pro: {
    projects: 20,
    storage: 50,
    color: "from-purple-500 to-purple-600",
    icon: Star
  },
  business: {
    projects: 40,
    storage: 100,
    color: "from-yellow-500 to-amber-600",
    icon: Zap
  }
}

export function CurrentPlanCard({ subscription, billingPortalUrl }: CurrentPlanCardProps) {
  const planKey = subscription.plan?.toLowerCase() as keyof typeof PLAN_FEATURES
  const planInfo = PLAN_FEATURES[planKey] || PLAN_FEATURES.basic
  
  const isActive = subscription.status === "active"
  const isTrialing = subscription.status === "trialing"
  const isPastDue = subscription.status === "past_due"
  const isCanceled = subscription.cancelAtPeriodEnd
  
  const IconComponent = planInfo.icon
  
  return (
    <Card className="lg:col-span-2">
      <CardHeader>
        <div className="flex items-center gap-3">
          <Crown className="h-5 w-5 flex-shrink-0 text-yellow-500" />
          <div>
            <CardTitle>Current Plan</CardTitle>
            <CardDescription>
              Your active subscription details and features
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {/* Plan Header */}
        <div className="flex flex-col sm:flex-row sm:items-center gap-4 mb-6">
          <div className="flex justify-center sm:justify-start">
            <div className={`h-16 w-16 bg-gradient-to-br ${planInfo.color} rounded-full flex items-center justify-center`}>
              <IconComponent className="h-8 w-8 text-white" />
            </div>
          </div>

          <div className="text-center sm:text-left space-y-2 flex-1">
            <div className="flex items-center gap-2 justify-center sm:justify-start">
              <h2 className="text-2xl font-bold">
                {subscription.plan?.toUpperCase()} Plan
              </h2>
              {isTrialing && (
                <Badge variant="secondary" className="text-xs">
                  Trial
                </Badge>
              )}
            </div>
            <StatusBadge
              status={subscription.status}
              className="w-fit mx-auto sm:mx-0"
            />
            {isCanceled && (
              <div className="flex items-center gap-2 text-orange-600 text-sm">
                <AlertTriangle className="h-4 w-4" />
                <span>Cancels at period end</span>
              </div>
            )}
          </div>
        </div>

        {/* Plan Features */}
        <div className="grid grid-cols-2 gap-4 mb-6 p-4 border rounded-lg">
          <div className="text-center">
            <div className="text-2xl font-bold text-primary">{planInfo.projects}</div>
            <div className="text-sm text-muted-foreground">Projects</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-primary">{planInfo.storage}GB</div>
            <div className="text-sm text-muted-foreground">Storage</div>
          </div>
        </div>

        <Separator className="my-6" />

        {/* Subscription Details */}
        <div className="grid gap-1 sm:gap-2">
          <SubscriptionInfoItem
            label="Current Period Start"
            value={formatDate(subscription.periodStart!)}
            icon={Calendar}
          />

          <SubscriptionInfoItem
            label="Current Period End"
            value={
              subscription.periodEnd
                ? formatDate(subscription.periodEnd)
                : "Ongoing"
            }
            icon={Calendar}
          />
          
          {subscription.seats && subscription.seats > 1 && (
            <SubscriptionInfoItem
              label="Seats"
              value={`${subscription.seats} users`}
              icon={Users}
            />
          )}
        </div>

        <Separator className="my-6" />

        {/* Action Buttons */}
        <div className="flex flex-col gap-3">
          <div className="flex flex-col sm:flex-row gap-3">
            <Link
              href={billingPortalUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1"
            >
              <Button variant="outline" className="w-full cursor-pointer">
                <Settings className="h-4 w-4 mr-2" />
                Manage Billing
              </Button>
            </Link>

            <Link href="/#pricing" className="flex-1">
              <Button variant="outline" className="w-full cursor-pointer">
                <RefreshCw className="h-4 w-4 mr-2" />
                Change Plan
              </Button>
            </Link>
          </div>
          
          {/* Subscription Management */}
          <div className="flex flex-col sm:flex-row gap-3">
            {isCanceled ? (
              <RestoreSubscriptionButton 
                subscriptionId={subscription.id}
                className="flex-1"
              />
            ) : (
              <CancelSubscriptionButton 
                subscriptionId={subscription.id}
                planName={subscription.plan || ""}
                className="flex-1"
              />
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}