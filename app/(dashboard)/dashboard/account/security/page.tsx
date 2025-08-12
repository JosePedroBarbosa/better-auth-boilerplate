import { Metadata } from "next"
import { PasswordChangeSection } from "./_components/password-change-section"
import { TwoFactorAuthSection } from "./_components/two-factor-auth-section"
import { ActiveSessionsSection } from "./_components/active-sessions-section"

import { DashboardHeader } from "@/components/dashboard/dashboard-header"

export const metadata: Metadata = {
  title: "Security Settings",
  description: "Update your password and secure your account",
}

export default function SecurityPage() {
  return (
    <div className="container max-w-6xl mx-auto px-4 space-y-8">
      <DashboardHeader
      title="Security Settings"
      description="Update your password and secure your account"
      backHref="/dashboard/account"
      backLabel="Back to Account"
    />
      <PasswordChangeSection />
      <TwoFactorAuthSection />
      <ActiveSessionsSection />
    </div>
  )
}