import { AppSidebar } from "./_components/app-sidebar";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { DashboardAuthGuard } from "./_components/dashboard-auth-guard";
import { Suspense } from "react";
import { CollapsibleHeader } from "./_components/collapsible-header ";
import { DashboardLoadingSkeleton } from "./_components/dashboard-loading-skeleton";

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  return (
    <SidebarProvider>
      <Suspense fallback={<DashboardLoadingSkeleton />}>
        <DashboardAuthGuard>
          <AppSidebar />
          <SidebarInset>
            <CollapsibleHeader />
            <div className="container max-w-6xl mx-auto px-4 py-6 space-y-8">
              {children}
            </div>
          </SidebarInset>
        </DashboardAuthGuard>
      </Suspense>
    </SidebarProvider>
  );
}
