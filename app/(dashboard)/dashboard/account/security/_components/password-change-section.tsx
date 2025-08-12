"use client"

import { useState, useCallback } from "react"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { Lock } from "lucide-react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { toast } from "sonner"
import { authClient } from "@/lib/auth-client"
import { PasswordField } from "./password-field"
import { passwordChangeSchema, PasswordChangeSchemaType } from "@/lib/schemas"

export function PasswordChangeSection() {
  const [showCurrent, setShowCurrent] = useState(false)
  const [showNew, setShowNew] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
    watch,
  } = useForm<PasswordChangeSchemaType>({
    resolver: zodResolver(passwordChangeSchema),
  })

  const newPassword = watch("newPassword", "")

  const onSubmit = useCallback(
    async (data: PasswordChangeSchemaType) => {
      try {
        const result = await authClient.changePassword({
          newPassword: data.newPassword,
          currentPassword: data.currentPassword,
          revokeOtherSessions: true,
        })

        if (result.error) {
          throw new Error(result.error.message || "Failed to update password")
        }

        toast.success("Password updated successfully!")
        reset()
      } catch (error: any) {
        toast.error(
          error?.message || "Failed to update password, please try again"
        )
        console.error("Change password error:", error)
      }
    },
    [reset]
  )

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-3">
          <Lock className="h-5 w-5 flex-shrink-0" />
          <div>
            <CardTitle>Change Password</CardTitle>
            <CardDescription>
              Set a new password for your account below
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <PasswordField
            label="Current Password"
            name="currentPassword"
            placeholder="Enter current password"
            register={register}
            error={errors.currentPassword}
            showPassword={showCurrent}
            onToggleShow={() => setShowCurrent((prev) => !prev)}
            autoComplete="current-password"
          />

          <PasswordField
            label="New Password"
            name="newPassword"
            placeholder="Enter new password"
            register={register}
            error={errors.newPassword}
            showPassword={showNew}
            onToggleShow={() => setShowNew((prev) => !prev)}
            autoComplete="new-password"
            showStrength={true}
            watchedValue={newPassword}
          />

          <PasswordField
            label="Confirm New Password"
            name="confirmPassword"
            placeholder="Confirm new password"
            register={register}
            error={errors.confirmPassword}
            showPassword={showConfirm}
            onToggleShow={() => setShowConfirm((prev) => !prev)}
            autoComplete="new-password"
          />

          <Separator />

          <div className="flex flex-col sm:flex-row gap-3">
            <Button
              type="submit"
              className="flex-1 sm:flex-none sm:min-w-[200px] cursor-pointer"
              disabled={isSubmitting}
            >
              <Lock className="h-4 w-4 mr-2" />
              {isSubmitting ? "Saving..." : "Save Changes"}
            </Button>

            <Button
              type="button"
              variant="outline"
              onClick={() => reset()}
              disabled={isSubmitting}
              className="flex-1 sm:flex-none cursor-pointer"
            >
              Reset Form
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}