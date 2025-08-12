import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import FormFooter from "@/components/form/form-footer";
import { Suspense } from "react";

interface AuthLayoutProps {
  children: React.ReactNode;
}

function AuthLoadingSpinner() {
  return (
    <div className="flex min-h-[400px] items-center justify-center">
      <div className="flex flex-col items-center space-y-4">
        <div className="relative">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-gray-200 border-t-blue-600"></div>
        </div>
        
        <p className="text-sm text-gray-600 animate-pulse">
          Loading...
        </p>
      </div>
    </div>
  );
}

export default async function AuthLayout({ children }: AuthLayoutProps) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (session) {
    redirect("/dashboard");
  }

  return (
    <div className="flex min-h-screen flex-col p-6 md:p-10">
      <div className="flex flex-1 items-center justify-center">
        <div className="w-full max-w-md">
          <Suspense fallback={<AuthLoadingSpinner />}>
            {children}
          </Suspense>
        </div>
      </div>
      <FormFooter className="mt-auto" />
    </div>
  );
}