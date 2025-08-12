import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { 
  CalendarDays, 
  Clock,
  Settings,
  Edit,
  UserCheck,
  Shield,
} from "lucide-react"
import Link from "next/link"
import { formatDate, formatRelativeDate } from "@/lib/utils"

interface User {
  createdAt: Date
  onboardedAt: Date | null
}

interface AccountActivityProps {
  user: User
}

export function AccountActivity({ user }: AccountActivityProps) {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-3">
          <Clock className="h-5 w-5 flex-shrink-0" />
          <div>
            <CardTitle>Account Activity</CardTitle>
            <CardDescription>Important dates and milestones</CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Account Created */}
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-sm font-medium">
            <CalendarDays className="h-4 w-4 text-muted-foreground" />
            Account Created
          </div>
          <div className="pl-6 space-y-1">
            <p className="text-sm text-muted-foreground">
              {formatDate(user.createdAt)}
            </p>
            <p className="text-xs text-muted-foreground">
              {formatRelativeDate(user.createdAt)}
            </p>
          </div>
        </div>

        {user.onboardedAt && (
          <>
            <Separator />
            
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm font-medium">
                <UserCheck className="h-4 w-4 text-green-600" />
                Setup Completed
              </div>
              <div className="pl-6 space-y-1">
                <p className="text-sm text-muted-foreground">
                  {formatDate(user.onboardedAt)}
                </p>
                <p className="text-xs text-muted-foreground">
                  {formatRelativeDate(user.onboardedAt)}
                </p>
              </div>
            </div>
          </>
        )}

      </CardContent>
    </Card>
  )
}