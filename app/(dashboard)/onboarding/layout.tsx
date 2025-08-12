import { ReactNode } from "react";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import OnboardingHeader from "./_components/OnboardingHeader";

export default async function OnboardingLayout({ 
  children 
}: { 
  children: ReactNode 
}) {
  const session = await auth.api.getSession({ 
    headers: await headers() 
  });

  if (!session) {
    redirect("/sign-in");
  }

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: { onboardedAt: true },
  });

  if (user?.onboardedAt) {
    redirect("/dashboard");
  }

  return (
    <div className="min-h-screen flex flex-col">
      <OnboardingHeader />
      <div className="flex-1 flex flex-col justify-center items-center px-4 pb-8">
        {children}
      </div>
    </div>
  );
}