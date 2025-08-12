"use server";

import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { revalidatePath } from "next/cache";
import { z } from "zod";

const updateProfileSchema = z.object({
  firstName: z.string()
    .trim()
    .min(1, "First name is required")
    .max(50, "First name must be less than 50 characters"),
  lastName: z.string()
    .trim()
    .min(1, "Last name is required")
    .max(50, "Last name must be less than 50 characters"),
  name: z.string()
    .trim()
    .min(3, "Username must have at least 3 characters")
    .max(30, "Username must be less than 30 characters")
    .regex(/^[a-zA-Z0-9_-]+$/, "Username can only contain letters, numbers, underscore and dash")
    .optional(),
  image: z.string().url().optional().or(z.literal("")),
  country: z.string().length(2).optional(), 
});

interface UpdateProfileResult {
  success: true;
  user: {
    id: string;
    firstName: string | null;
    lastName: string | null;
    country: string | null;
    name: string | null;
    image: string | null;
  };
}

export async function updateProfile(data: z.infer<typeof updateProfileSchema>): Promise<UpdateProfileResult> {
  try {
    // Validação da sessão
    const headersList = await headers();
    const session = await auth.api.getSession({ 
      headers: new Headers(headersList) 
    });
    
    if (!session?.user?.id) {
      throw new Error("Authentication required");
    }

    const validatedData = updateProfileSchema.parse(data);
    const { firstName, lastName, name, image, country } = validatedData;

    if (name) {
      const existingUser = await prisma.user.findFirst({
        where: { 
          name,
          NOT: { id: session.user.id } 
        },
        select: { id: true }
      });

      if (existingUser) {
        throw new Error("Username already taken");
      }
    }

    const updatedUser = await prisma.user.update({
      where: { id: session.user.id },
      data: {
        firstName,
        lastName,
        ...(name && { name }),
        ...(image !== undefined && { image: image || null }),
        ...(country && { country: country.toLowerCase() }),
        updatedAt: new Date(), 
      },
      select: {
        id: true,
        firstName: true,
        lastName: true,
        country: true,
        name: true,
        image: true,
      },
    });

    // Revalidar caches relacionados
    revalidatePath("/dashboard/account");
    revalidatePath("/dashboard/profile");
    revalidatePath("/profile/[id]", "page");

    return { success: true, user: updatedUser };

  } catch (error) {
    console.error("Update profile error:", error);
    
    if (error instanceof Error) {
      if (error.name === "ZodError") {
        throw new Error("Invalid data provided");
      }
      
      if (error.message.includes("Unique constraint")) {
        throw new Error("Username already taken");
      }
      
      throw error;
    }
    
    throw new Error("Failed to update profile");
  }
}

export async function checkUsernameAvailability(username: string): Promise<{ available: boolean }> {
  try {
    const session = await auth.api.getSession({ 
      headers: await headers() 
    });
    
    if (!session?.user?.id) {
      throw new Error("Authentication required");
    }

    // Validação básica do username
    if (!username || username.length < 3 || username.length > 30) {
      return { available: false };
    }

    if (!/^[a-zA-Z0-9_-]+$/.test(username)) {
      return { available: false };
    }

    const existingUser = await prisma.user.findFirst({
      where: { 
        name: username,
        NOT: { id: session.user.id }
      },
      select: { id: true }
    });

    return { available: !existingUser };

  } catch (error) {
    console.error("Check username error:", error);
    return { available: false };
  }
}