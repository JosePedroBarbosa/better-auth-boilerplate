import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Separator } from "@/components/ui/separator"
import { 
  Info, 
  Shield, 
  CheckCircle, 
  AlertTriangle, 
  Download, 
  Copy 
} from "lucide-react"
import { QRCodeSVG } from "qrcode.react"
import { toast } from "sonner"

interface TwoFactorSetupProps {
  setupStep: "verify-password" | "scan-qr" | "verify-code" | "backup-codes" | "completed"
  isEnabling: boolean
  twoFactorURI: string | null
  backupCodes: string[] | null
  otpCode: string
  setOtpCode: (code: string) => void
  isVerifyingOtp: boolean
  copiedCodes: Set<number>
  setCopiedCodes: React.Dispatch<React.SetStateAction<Set<number>>>
  onEnable: (password: string) => Promise<void>
  onVerify: () => Promise<void>
  onComplete: () => void
  onReset: () => void
}

export function TwoFactorSetup({
  setupStep,
  isEnabling,
  twoFactorURI,
  backupCodes,
  otpCode,
  setOtpCode,
  isVerifyingOtp,
  copiedCodes,
  setCopiedCodes,
  onEnable,
  onVerify,
  onComplete,
  onReset,
}: TwoFactorSetupProps) {
  const handleEnableSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const formData = new FormData(e.currentTarget as HTMLFormElement)
    const password = formData.get("2fa-password")?.toString() || ""
    
    try {
      await onEnable(password)
      toast.success("Scan the QR code with your authenticator app")
    } catch (error: any) {
      toast.error(error.message || "Failed to enable 2FA")
    }
  }

  const handleVerifySubmit = async () => {
    try {
      await onVerify()
      toast.success("2FA successfully verified!")
    } catch (error: any) {
      toast.error(error.message || "Failed to verify 2FA")
    }
  }

  const handleOtpChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, "").slice(0, 6)
    setOtpCode(value)
  }

  const handleOtpKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && otpCode.length === 6) {
      e.preventDefault()
      handleVerifySubmit()
    }
  }

  const copyBackupCode = (code: string, index: number) => {
    navigator.clipboard.writeText(code)
    setCopiedCodes((prev) => new Set([...prev, index]))
    toast.success("Backup code copied to clipboard")
  }

  const downloadBackupCodes = () => {
    if (!backupCodes) return

    const content = `Two-Factor Authentication Backup Codes\n\nThese codes can be used to access your account if you lose access to your authenticator app.\nKeep them in a safe place!\n\n${backupCodes.join("\n")}\n\nGenerated on: ${new Date().toISOString()}`

    const blob = new Blob([content], { type: "text/plain" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = "backup-codes.txt"
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)

    toast.success("Backup codes downloaded")
  }

  if (setupStep === "verify-password") {
    return (
      <div className="space-y-6">
        <form onSubmit={handleEnableSubmit} className="space-y-4">
          <Alert>
            <Info className="h-4 w-4" />
            <AlertDescription>
              Enable 2FA to add an extra layer of security to your
              account. You'll need an authenticator app like Google
              Authenticator or Authy.
            </AlertDescription>
          </Alert>

          <div>
            <label className="block text-sm font-medium mb-2">
              Confirm your password to continue
            </label>
            <Input
              name="2fa-password"
              type="password"
              placeholder="Enter your password"
              required
              autoComplete="current-password"
            />
          </div>

          <Button
            type="submit"
            disabled={isEnabling}
            className="w-full sm:w-auto cursor-pointer mt-2"
          >
            <Shield className="h-4 w-4 mr-2" />
            {isEnabling ? "Setting up 2FA..." : "Continue Setup"}
          </Button>
        </form>
      </div>
    )
  }

  if (setupStep === "scan-qr" && twoFactorURI) {
    return (
      <div className="space-y-6">
        <div className="space-y-6">
          <div>
            <h3 className="font-semibold text-lg mb-2">
              Step 1: Scan QR Code
            </h3>
            <p className="text-sm text-muted-foreground">
              Scan this QR code with your authenticator app (Google
              Authenticator, Authy, etc.)
            </p>
          </div>

          <div className="flex justify-center">
            <div className="p-6 border-2 border-dashed border-muted-foreground/25 rounded-xl bg-muted/30">
              <QRCodeSVG value={twoFactorURI} size={200} />
            </div>
          </div>
        </div>

        <Separator />

        <div className="space-y-6">
          <div>
            <h3 className="font-semibold text-lg mb-2">
              Step 2: Enter Verification Code
            </h3>
            <p className="text-sm text-muted-foreground">
              Enter the 6-digit code from your authenticator app
            </p>
          </div>

          <div className="space-y-6">
            <Input
              type="text"
              value={otpCode}
              onChange={handleOtpChange}
              onKeyDown={handleOtpKeyDown}
              maxLength={6}
              placeholder="000000"
              className="text-center text-xl tracking-[0.5em] font-mono max-w-xs mx-auto"
              inputMode="numeric"
              pattern="[0-9]*"
              autoFocus
            />

            <div className="flex flex-col sm:flex-row gap-3">
              <Button
                type="button"
                onClick={handleVerifySubmit}
                disabled={isVerifyingOtp || otpCode.length !== 6}
                className="flex-1 mt-2 cursor-pointer"
              >
                {isVerifyingOtp ? "Verifying..." : "Verify & Continue"}
              </Button>

              <Button
                type="button"
                variant="outline"
                onClick={onReset}
                disabled={isVerifyingOtp}
                className="flex-1 sm:flex-none mt-2 cursor-pointer"
              >
                Cancel
              </Button>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (setupStep === "backup-codes" && backupCodes) {
    return (
      <div className="space-y-6">
        <div>
          <h3 className="font-semibold text-lg mb-3">
            Step 3: Save Your Backup Codes
          </h3>
          <Alert>
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>
              <strong>Important:</strong> Save these backup codes in a
              safe place. You can use them to access your account if
              you lose your authenticator device.
            </AlertDescription>
          </Alert>
        </div>

        <div className="space-y-4">
          <Button
            type="button"
            variant="outline"
            onClick={downloadBackupCodes}
            className="w-full sm:w-auto cursor-pointer"
          >
            <Download className="h-4 w-4 mr-2" />
            Download Backup Codes
          </Button>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-4 bg-muted/50 rounded-lg border">
            {backupCodes.map((code, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-3 bg-background rounded-md border shadow-sm"
              >
                <code className="text-sm font-mono text-foreground">
                  {code}
                </code>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => copyBackupCode(code, index)}
                  className="ml-2 h-8 w-8 p-0 hover:bg-muted"
                  title="Copy code"
                >
                  {copiedCodes.has(index) ? (
                    <CheckCircle className="h-4 w-4 text-green-600" />
                  ) : (
                    <Copy className="h-4 w-4" />
                  )}
                </Button>
              </div>
            ))}
          </div>

          <Button
            onClick={() => {
              onComplete()
              toast.success("2FA setup completed! Your account is now more secure.")
            }}
            className="w-full cursor-pointer"
            size="lg"
          >
            <CheckCircle className="h-4 w-4 mr-2" />
            Complete 2FA Setup
          </Button>
        </div>
      </div>
    )
  }

  if (setupStep === "completed") {
    return (
      <Alert>
        <CheckCircle className="h-4 w-4" />
        <AlertDescription>
          Two-factor authentication has been successfully enabled!
          Your account is now more secure.
        </AlertDescription>
      </Alert>
    )
  }

  return null
}