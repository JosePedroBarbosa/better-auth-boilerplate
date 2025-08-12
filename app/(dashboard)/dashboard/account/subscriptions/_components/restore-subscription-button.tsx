"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { CheckCircle, Loader2, RotateCcw } from "lucide-react"
import { restoreSubscription } from "../_actions/server"
import { toast } from "sonner"
import { cn } from "@/lib/utils"

interface RestoreSubscriptionButtonProps {
  subscriptionId: string
  className?: string
}

export function RestoreSubscriptionButton({ 
  subscriptionId, 
  className 
}: RestoreSubscriptionButtonProps) {
  const [isLoading, setIsLoading] = useState(false)

  const handleRestore = async () => {
    setIsLoading(true)
    
    try {
      const result = await restoreSubscription({ subscriptionId })
      
      if (result.success) {
        toast.success("Subscription restored successfully!")
      } else {
        toast.error(result.error || "Failed to restore subscription")
      }
    } catch (error) {
      toast.error("An unexpected error occurred")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Button 
      onClick={handleRestore}
      disabled={isLoading}
      className={cn("cursor-pointer", className)}
    >
      {isLoading ? (
        <>
          <Loader2 className="h-4 w-4 mr-2 animate-spin" />
          Restoring...
        </>
      ) : (
        <>
          <RotateCcw className="h-4 w-4 mr-2" />
          Restore Subscription
        </>
      )}
    </Button>
  )
}