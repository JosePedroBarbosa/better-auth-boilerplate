import { headers } from "next/headers"
import { redirect } from "next/navigation"
import { prisma } from "@/lib/prisma"
import { auth, stripeClient } from "@/lib/auth"
import { cache } from "react"
import { getActiveSubscription } from "./_actions/server"
import { DashboardHeader } from "@/components/dashboard/dashboard-header"
import { ActiveSubscription } from "./_components/active-subscription"
import { NoSubscription } from "./_components/no-subscription"
import { Metadata } from "next"

export const metadata: Metadata = {
  title: "Subscription Management",
  description: "Manage your current plan, billing, and subscription settings",
}

// Cache the subscription data
const getSubscriptionData = cache(async () => {
  const session = await auth.api.getSession({ headers: await headers() })
  
  if (!session?.user?.id) {
    redirect("/sign-in")
  }

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: {
      stripeCustomerId: true,
    },
  })

  if (!user?.stripeCustomerId) {
    redirect("/sign-in")
  }

  // Create Stripe billing portal session
  const billingPortalSession = await stripeClient.billingPortal.sessions.create({
    customer: user.stripeCustomerId,
    return_url: `${process.env.NEXT_PUBLIC_URL}/dashboard/account/subscriptions`,
  })

  // Get active subscription
  const { subscription } = await getActiveSubscription()

  return {
    subscription,
    billingPortalUrl: billingPortalSession.url,
  }
})

export default async function SubscriptionsPage() {
  const { subscription, billingPortalUrl } = await getSubscriptionData()

  return (
    <div className="container max-w-6xl mx-auto px-4 space-y-8">
      <DashboardHeader
      title="Subscription Management"
      description="Manage your current plan, billing, and subscription settings"
      backHref="/dashboard/account"
      backLabel="Back to Account"
    />
      
      {subscription ? (
        <ActiveSubscription 
          subscription={subscription} 
          billingPortalUrl={billingPortalUrl} 
        />
      ) : (
        <NoSubscription />
      )}
    </div>
  )
}