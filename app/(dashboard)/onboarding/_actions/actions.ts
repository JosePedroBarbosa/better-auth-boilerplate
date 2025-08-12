"use server";

import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { headers } from "next/headers";
import { onboardingSchema } from "@/lib/schemas";

interface OnboardingResult {
  success: true;
  user: {
    id: string;
    firstName: string;
    lastName: string;
    country: string;
    image: string | null;
    onboardedAt: Date;
  };
}

export async function onboardingUser(data: unknown): Promise<OnboardingResult> {
  const validatedData = onboardingSchema.parse(data);
  
  const headersList = await headers();
  const session = await auth.api.getSession({ 
    headers: headersList 
  });
  
  if (!session?.user?.id) {
    throw new Error("Not authenticated");
  }

  const { firstName, lastName, country, photo } = validatedData;

  try {
    const existingUser = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: { onboardedAt: true },
    });

    if (existingUser?.onboardedAt) {
      throw new Error("User already onboarded");
    }

    const updatedUser = await prisma.user.update({
      where: { id: session.user.id },
      data: {
        firstName: firstName.trim(),
        lastName: lastName.trim(),
        country: country.toLowerCase(),
        image: photo || null,
        onboardedAt: new Date(),
      },
      select: {
        id: true,
        firstName: true,
        lastName: true,
        country: true,
        image: true,
        onboardedAt: true,
      },
    });

    return { 
      success: true, 
      user: updatedUser as OnboardingResult['user']
    };
  } catch (error) {
    console.error("Onboarding error:", error);
    
    if (error instanceof Error) {
      throw error;
    }
    
    throw new Error("Failed to complete onboarding");
  }
}