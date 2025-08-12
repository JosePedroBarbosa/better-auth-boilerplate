import { CurrentPlanCard } from "./current-plan-card"
import { BillingInfoCard } from "./billing-info-card"
import { Subscription } from "@better-auth/stripe"

interface ActiveSubscriptionProps {
  subscription: Subscription
  billingPortalUrl: string
}

export function ActiveSubscription({ subscription, billingPortalUrl }: ActiveSubscriptionProps) {
  return (
    <div className="grid gap-6 lg:grid-cols-3">
      <CurrentPlanCard 
        subscription={subscription} 
        billingPortalUrl={billingPortalUrl} 
      />
      <BillingInfoCard 
        subscription={subscription} 
        billingPortalUrl={billingPortalUrl} 
      />
    </div>
  )
}