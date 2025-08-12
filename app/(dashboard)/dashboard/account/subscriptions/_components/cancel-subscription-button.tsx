"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { AlertTriangle, Loader2, XCircle } from "lucide-react"
import { cancelSubscription } from "../_actions/server"
import { toast } from "sonner"
import { cn } from "@/lib/utils"

interface CancelSubscriptionButtonProps {
  subscriptionId: string
  planName: string
  className?: string
}

export function CancelSubscriptionButton({ 
  subscriptionId, 
  planName, 
  className 
}: CancelSubscriptionButtonProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const handleCancel = async () => {
    setIsLoading(true)
    
    try {
      const result = await cancelSubscription({ 
        subscriptionId,
        returnUrl: window.location.href
      })
      
      if (result.success) {
        toast.success("Subscription canceled successfully")
        setIsOpen(false)
        // Redirect to billing portal for final confirmation
        if (result.data?.url) {
          window.open(result.data.url, '_blank')
        }
      } else {
        toast.error(result.error || "Failed to cancel subscription")
      }
    } catch (error) {
      toast.error("An unexpected error occurred")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="destructive" className={cn("cursor-pointer", className)}>
          <XCircle className="h-4 w-4 mr-2" />
          Cancel Subscription
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-destructive" />
            Cancel {planName} Subscription
          </DialogTitle>
          <DialogDescription className="space-y-2">
            <p>
              Are you sure you want to cancel your subscription? You'll continue to have access 
              to all features until the end of your current billing period.
            </p>
            <p className="text-sm text-muted-foreground">
              You can reactivate your subscription at any time before the period ends.
            </p>
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button 
            variant="outline" 
            onClick={() => setIsOpen(false)}
            disabled={isLoading}
          >
            Keep Subscription
          </Button>
          <Button 
            variant="destructive" 
            onClick={handleCancel}
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Canceling...
              </>
            ) : (
              "Cancel Subscription"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}