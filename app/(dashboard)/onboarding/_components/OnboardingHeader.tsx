"use client";

import Link from "next/link";
import Image from "next/image";
import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { authClient } from "@/lib/auth-client";
import { LogOut } from "lucide-react";
import Logo from "@/public/logo.svg";

export default function OnboardingHeader() {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const handleSignOut = () => {
    startTransition(async () => {
      try {
        await authClient.signOut();
        toast.success("Signed out successfully");
        router.replace("/");
      } catch (error) {
        toast.error("Failed to sign out");
        console.error("Sign out error:", error);
      }
    });
  };

  return (
    <header className="w-full max-w-[1200px] mx-auto px-4 pt-6">
      <div className="flex items-center justify-between">
        <Link 
          href="/" 
          className="flex items-center gap-2 hover:opacity-80 transition-opacity"
          aria-label="Go to homepage"
        >
          <Image 
            src={Logo} 
            className="dark:invert" 
            alt="Company Logo" 
            width={40} 
            height={40}
            priority
          />
        </Link>

        <Button
          onClick={handleSignOut}
          disabled={isPending}
          variant="blue"
          size="sm"
          className="text-neutral-300 hover:text-white hover:bg-neutral-800 transition-colors cursor-pointer"
        >
          {isPending ? (
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white" />
          ) : (
            <>
              <LogOut className="h-4 w-4 mr-2" />
              Sign out
            </>
          )}
        </Button>
      </div>
    </header>
  );
}