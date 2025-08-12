import { Skeleton } from "@/components/ui/skeleton"
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar"

export function DashboardLoadingSkeleton() {
  return (
    <SidebarProvider>
      <div className="w-64 h-screen bg-muted/10 border-r">
        <div className="p-4 space-y-4">
          <Skeleton className="h-8 w-32" />
          <div className="space-y-2">
            {Array.from({ length: 6 }).map((_, i) => (
              <Skeleton key={i} className="h-10 w-full" />
            ))}
          </div>
        </div>
      </div>
      <SidebarInset>
        <div className="flex h-16 items-center gap-2 px-4 border-b">
          <Skeleton className="h-8 w-8" />
          <Skeleton className="h-4 w-px" />
        </div>
        <div className="flex-1 p-4 space-y-4">
          <Skeleton className="h-8 w-48" />
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 3 }).map((_, i) => (
              <Skeleton key={i} className="h-32 w-full" />
            ))}
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}