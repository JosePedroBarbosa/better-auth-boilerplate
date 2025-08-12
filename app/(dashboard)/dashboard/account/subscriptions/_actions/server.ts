"use server"

import { auth } from "@/lib/auth"
import { Subscription } from "@better-auth/stripe"
import { headers } from "next/headers"
import { cache } from "react"
import { redirect } from "next/navigation"
import { revalidatePath } from "next/cache"

// Cache the subscription check to avoid duplicate queries
export const getActiveSubscription = cache(async (): Promise<{
  status: boolean
  message?: string
  subscription: Subscription | null
}> => {
  try {
    const session = await auth.api.getSession({ headers: await headers() })
    
    if (!session?.user?.id) {
      return {
        status: false,
        message: "Authentication required.",
        subscription: null,
      }
    }

    const activeSubs = await auth.api.listActiveSubscriptions({
      headers: await headers(),
    })

    const activeSub = activeSubs.find((sub) => 
      ["active", "trialing", "past_due"].includes(sub.status)
    ) ?? null

    return {
      subscription: activeSub,
      status: true,
    }
  } catch (error) {
    console.error("Error fetching subscription:", error)
    return {
      status: false,
      message: "Failed to retrieve subscription information.",
      subscription: null,
    }
  }
})

// Get all subscriptions (including canceled)
export const getAllSubscriptions = cache(async (): Promise<{
  status: boolean
  subscriptions: Subscription[]
  message?: string
}> => {
  try {
    const session = await auth.api.getSession({ headers: await headers() })
    
    if (!session?.user?.id) {
      return {
        status: false,
        subscriptions: [],
        message: "Authentication required.",
      }
    }

    const subscriptions = await auth.api.listActiveSubscriptions({
      headers: await headers(),
    })

    return {
      status: true,
      subscriptions,
    }
  } catch (error) {
    console.error("Error fetching subscriptions:", error)
    return {
      status: false,
      subscriptions: [],
      message: "Failed to retrieve subscriptions.",
    }
  }
})

// Upgrade subscription
export async function upgradeSubscription({
  plan,
  annual = false,
  seats,
}: {
  plan: string
  annual?: boolean
  seats?: number
}) {
  try {
    const session = await auth.api.getSession({ headers: await headers() })
    
    if (!session?.user?.id) {
      throw new Error("Authentication required")
    }

    const { subscription: currentSub } = await getActiveSubscription()
    
    const response = await auth.api.upgradeSubscription({
      headers: await headers(),
      body: {
        plan,
        annual,
        referenceId: session.user.id,
        subscriptionId: currentSub?.id,
        seats,
        successUrl: `${process.env.NEXT_PUBLIC_URL}/dashboard/account/subscriptions?success=true`,
        cancelUrl: `${process.env.NEXT_PUBLIC_URL}/dashboard/account/subscriptions?canceled=true`,
      },
    })

    revalidatePath("/dashboard/account/subscriptions")
    return { success: true, data: response }
  } catch (error) {
    console.error("Error upgrading subscription:", error)
    return { 
      success: false, 
      error: error instanceof Error ? error.message : "Failed to upgrade subscription" 
    }
  }
}

// Cancel subscription
export async function cancelSubscription({
  subscriptionId,
  returnUrl,
}: {
  subscriptionId?: string
  returnUrl?: string
}) {
  try {
    const session = await auth.api.getSession({ headers: await headers() })
    
    if (!session?.user?.id) {
      throw new Error("Authentication required")
    }

    const response = await auth.api.cancelSubscription({
      headers: await headers(),
      body: {
        referenceId: session.user.id,
        subscriptionId,
        returnUrl: returnUrl || `${process.env.NEXT_PUBLIC_URL}/dashboard/account/subscriptions`,
      },
    })

    revalidatePath("/dashboard/account/subscriptions")
    return { success: true, data: response }
  } catch (error) {
    console.error("Error canceling subscription:", error)
    return { 
      success: false, 
      error: error instanceof Error ? error.message : "Failed to cancel subscription" 
    }
  }
}

// Restore subscription
export async function restoreSubscription({
  subscriptionId,
}: {
  subscriptionId?: string
}) {
  try {
    const session = await auth.api.getSession({ headers: await headers() })
    
    if (!session?.user?.id) {
      throw new Error("Authentication required")
    }

    const response = await auth.api.restoreSubscription({
      headers: await headers(),
      body: {
        referenceId: session.user.id,
        subscriptionId,
      },
    })

    revalidatePath("/dashboard/account/subscriptions")
    return { success: true, data: response }
  } catch (error) {
    console.error("Error restoring subscription:", error)
    return { 
      success: false, 
      error: error instanceof Error ? error.message : "Failed to restore subscription" 
    }
  }
}

// Get subscription status with plan limits
export const getSubscriptionStatus = cache(async (): Promise<{
  hasActiveSubscription: boolean
  subscriptionType: string | null
  status: string | null
  limits: {
    projects: number
    storage: number
  } | null
  canUpgrade: boolean
  canDowngrade: boolean
}> => {
  const { subscription } = await getActiveSubscription()
  
  const planLimits = {
    basic: { projects: 5, storage: 10 },
    pro: { projects: 20, storage: 50 },
    business: { projects: 40, storage: 100 },
  }
  
  const currentPlan = subscription?.plan as keyof typeof planLimits
  
  return {
    hasActiveSubscription: !!subscription && ["active", "trialing"].includes(subscription.status),
    subscriptionType: subscription?.plan || null,
    status: subscription?.status || null,
    limits: currentPlan ? planLimits[currentPlan] : null,
    canUpgrade: currentPlan ? currentPlan !== "business" : true,
    canDowngrade: currentPlan ? currentPlan !== "basic" : false,
  }
})