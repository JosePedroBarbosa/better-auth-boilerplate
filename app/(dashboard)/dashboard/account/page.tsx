import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { cache } from "react";
import { AccountProfile } from "./_components/account-profile";
import { AccountActivity } from "./_components/account-activity";
import { AccountOnboardingPrompt } from "./_components/account-onboarding-prompt";
import { DashboardHeader } from "@/components/dashboard/dashboard-header";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "My Account",
  description: "Manage your personal information and account settings",
};

// Cache the user data to avoid duplicate queries
const getUserAccountData = cache(async () => {
  const session = await auth.api.getSession({ headers: await headers() });

  if (!session?.user?.id) {
    redirect("/sign-in");
  }

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: {
      firstName: true,
      lastName: true,
      country: true,
      name: true,
      email: true,
      image: true,
      createdAt: true,
      onboardedAt: true,
    },
  });

  if (!user) {
    redirect("/sign-in");
  }

  return user;
});

export default async function AccountPage() {
  const user = await getUserAccountData();

  return (
    <div className="container max-w-6xl mx-auto px-4 space-y-8">
      <DashboardHeader
        title="My Account"
        description="Manage your personal information and account settings"
        backHref="/dashboard"
        backLabel="Back to Dashboard"
      />

      {/* Main Content Grid */}
      <div className="grid gap-6 lg:grid-cols-3">
        <AccountProfile user={user} />
        <AccountActivity user={user} />
      </div>

      {/* Onboarding prompt if not completed */}
      {!user.onboardedAt && <AccountOnboardingPrompt />}
    </div>
  );
}