import { headers } from "next/headers"
import { redirect } from "next/navigation"
import { prisma } from "@/lib/prisma"
import { auth } from "@/lib/auth"
import { cache } from "react"

interface DashboardAuthGuardProps {
  children: React.ReactNode
}

// Cache the user check to avoid duplicate queries
const getUserOnboardingStatus = cache(async () => {
  const session = await auth.api.getSession({ headers: await headers() })
  
  if (!session?.user?.id) {
    redirect("/sign-in")
  }

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: {
      onboardedAt: true,
    },
  })

  if (!user) {
    redirect("/sign-in")
  }

  if (!user.onboardedAt) {
    redirect("/onboarding")
  }

  return { user, session }
})

export async function DashboardAuthGuard({ children }: DashboardAuthGuardProps) {
  await getUserOnboardingStatus()
  
  return <>{children}</>
}