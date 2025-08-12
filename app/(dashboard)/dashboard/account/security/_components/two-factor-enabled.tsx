import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { CheckCircle, AlertTriangle, ShieldX } from "lucide-react"
import { toast } from "sonner"

interface TwoFactorEnabledProps {
  onDisable: (password: string) => Promise<void>
  isDisabling: boolean
}

export function TwoFactorEnabled({ onDisable, isDisabling }: TwoFactorEnabledProps) {
  const handleDisableSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const formData = new FormData(e.currentTarget as HTMLFormElement)
    const password = formData.get("disable-2fa-password")?.toString() || ""
    
    try {
      await onDisable(password)
      toast.success("2FA has been disabled successfully")
    } catch (error: any) {
      toast.error(error.message || "Failed to disable 2FA")
    }
  }

  return (
    <div className="space-y-6">
      <Alert>
        <CheckCircle className="h-4 w-4" />
        <AlertDescription>
          Two-factor authentication is currently enabled for your
          account. This provides an extra layer of security when signing
          in.
        </AlertDescription>
      </Alert>

      <form onSubmit={handleDisableSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-2">
            Confirm your password to disable 2FA
          </label>
          <Input
            name="disable-2fa-password"
            type="password"
            placeholder="Enter your password"
            required
            autoComplete="current-password"
          />
        </div>

        <Alert variant="destructive">
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>
            <strong>Warning:</strong> Disabling 2FA will make your
            account less secure. Anyone with access to your password
            will be able to sign in.
          </AlertDescription>
        </Alert>

        <Button
          type="submit"
          variant="destructive"
          disabled={isDisabling}
          className="w-full sm:w-auto cursor-pointer mt-2"
        >
          <ShieldX className="h-4 w-4 mr-2" />
          {isDisabling
            ? "Disabling 2FA..."
            : "Disable Two-Factor Authentication"}
        </Button>
      </form>
    </div>
  )
}