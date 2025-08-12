import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { cache } from "react";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import EditProfileForm from "./_component/EditProfileForm";
import type { Metadata } from "next";

// Cache da função de busca do usuário para evitar múltiplas queries
const getUser = cache(async (userId: string) => {
  return await prisma.user.findUnique({
    where: { id: userId },
    select: {
      id: true,
      firstName: true,
      lastName: true,
      country: true,
      name: true,
      image: true,
      email: true,
      createdAt: true,
    },
  });
});

const validateSession = cache(async () => {
  const session = await auth.api.getSession({ 
    headers: await headers() 
  });
  
  if (!session?.user?.id) {
    redirect("/sign-in");
  }
  
  return session;
});

export async function generateMetadata(): Promise<Metadata> {
  try {
    const session = await validateSession();
    const user = await getUser(session.user.id);
    
    const userName = user?.firstName 
      ? `${user.firstName} ${user.lastName || ''}`.trim()
      : user?.name || 'User';

    return {
      title: `Edit Profile - ${userName}`,
      description: "Update your personal information and profile settings",
      robots: "noindex", 
    };
  } catch {
    return {
      title: "Edit Profile",
      description: "Update your personal information and profile settings",
    };
  }
}

export default async function EditProfilePage() {
  const session = await validateSession();
  
  const user = await getUser(session.user.id);
  
  if (!user) {
    redirect("/sign-in");
  }

  return (
    <>      
      <EditProfileForm user={user} />
    </>
  );
}