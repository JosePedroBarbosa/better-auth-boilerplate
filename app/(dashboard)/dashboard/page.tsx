import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { cache } from "react";
import { DashboardWelcome } from "./_components/dashboard-welcome";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Dashboard",
  description: "Your personal dashboard overview",
};

const getDashboardData = cache(async () => {
  const session = await auth.api.getSession({ headers: await headers() });

  if (!session?.user?.id) {
    return null;
  }

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: {
      name: true,
      firstName: true,
      lastName: true,
      onboardedAt: true,
      createdAt: true,
    },
  });

  return { user, session };
});

export default async function DashboardPage() {
  const data = await getDashboardData();

  if (!data?.user) {
    return (
      <div className="flex items-center justify-center h-96">
        <p className="text-muted-foreground">Unable to load dashboard data</p>
      </div>
    );
  }

  const { user } = data;
  const displayName = user.firstName || user.name || "User";

  return (
    <div className="w-full px-4 space-y-8">
      <DashboardWelcome userName={displayName} />
    </div>
  );
}
