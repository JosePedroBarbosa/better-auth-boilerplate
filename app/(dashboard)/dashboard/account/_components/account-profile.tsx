import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { 
  Mail, 
  User, 
  Shield, 
  MapPin,
  Edit,
} from "lucide-react"
import Link from "next/link"
import { ProfileInfoItem } from "./profile-info-item"
import { getUserInitials } from "@/lib/utils"

interface User {
  firstName: string | null
  lastName: string | null
  country: string | null
  name: string | null
  email: string
  image: string | null
}

interface AccountProfileProps {
  user: User
}

export function AccountProfile({ user }: AccountProfileProps) {
  const displayName = user.name || "Unknown User"
  const initials = getUserInitials(displayName)

  return (
    <Card className="lg:col-span-2">
      <CardHeader>
        <div className="flex items-center gap-3">
          <User className="h-5 w-5 flex-shrink-0" />
          <div>
            <CardTitle>Profile Information</CardTitle>
            <CardDescription>Your personal details and contact information</CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {/* Profile Header */}
        <div className="flex flex-col sm:flex-row sm:items-center gap-6 mb-6">
          <Avatar className="h-24 w-24 mx-auto sm:mx-0">
            <AvatarImage src={user.image || ""} alt={displayName} />
            <AvatarFallback className="text-xl font-semibold">
              {initials}
            </AvatarFallback>
          </Avatar>
          
          <div className="text-center sm:text-left space-y-2 flex-1">
            <h2 className="text-2xl font-bold">{displayName}</h2>
            <p className="text-muted-foreground flex items-center justify-center sm:justify-start gap-2">
              <Mail className="h-4 w-4" />
              {user.email}
            </p>
          </div>
        </div>

        <Separator className="my-6" />

        {/* Profile Details */}
        <div className="grid gap-1 sm:gap-2">
          <ProfileInfoItem
            label="Display Name"
            value={user.name || "Not set"}
            icon={User}
          />
          
          <ProfileInfoItem
            label="First Name"
            value={user.firstName || "Not provided"}
          />
          
          <ProfileInfoItem
            label="Last Name"
            value={user.lastName || "Not provided"}
          />
          
          <ProfileInfoItem
            label="Country"
            value={user.country?.toUpperCase() || "Not specified"}
            icon={MapPin}
          />
          
          <ProfileInfoItem
            label="Email Address"
            value={user.email}
            icon={Mail}
          />
        </div>

        <Separator className="my-6" />

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-3">
          <Link href="/dashboard/account/edit" className="flex-1">
            <Button variant="outline" className="w-full cursor-pointer">
              <Edit className="h-4 w-4 mr-2" />
              Edit Profile
            </Button>
          </Link>
          
          <Link href="/dashboard/account/security" className="flex-1">
            <Button variant="outline" className="w-full cursor-pointer">
              <Shield className="h-4 w-4 mr-2" />
              Security Settings
            </Button>
          </Link>
        </div>
      </CardContent>
    </Card>
  )
}