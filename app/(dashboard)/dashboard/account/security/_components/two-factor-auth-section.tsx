"use client"

import { useState, useCallback, useEffect } from "react"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Shield, ShieldCheck, ShieldX } from "lucide-react"
import { authClient } from "@/lib/auth-client"
import { TwoFactorEnabled } from "./two-factor-enabled"
import { TwoFactorSetup } from "./two-factor-setup"

interface TwoFactorSetupStep {
  step:
    | "verify-password"
    | "scan-qr"
    | "verify-code"
    | "backup-codes"
    | "completed"
}

export function TwoFactorAuthSection() {
  const [is2FAEnabled, setIs2FAEnabled] = useState(false)
  const [isLoading2FAStatus, setIsLoading2FAStatus] = useState(true)
  const [setupStep, setSetupStep] = useState<TwoFactorSetupStep["step"]>("verify-password")
  const [is2FAEnabling, setIs2FAEnabling] = useState(false)
  const [is2FADisabling, setIs2FADisabling] = useState(false)
  const [twoFactorURI, setTwoFactorURI] = useState<string | null>(null)
  const [backupCodes, setBackupCodes] = useState<string[] | null>(null)
  const [otpCode, setOtpCode] = useState("")
  const [isVerifyingOtp, setIsVerifyingOtp] = useState(false)
  const [copiedCodes, setCopiedCodes] = useState<Set<number>>(new Set())

  // Check 2FA status on component mount
  useEffect(() => {
    check2FAStatus()
  }, [])

  const check2FAStatus = useCallback(async () => {
    try {
      setIsLoading2FAStatus(true)
      const { data } = await authClient.getSession()
      setIs2FAEnabled(data?.user.twoFactorEnabled || false)
    } catch (error) {
      console.error("Error checking 2FA status:", error)
    } finally {
      setIsLoading2FAStatus(false)
    }
  }, [])

  const resetSetupFlow = useCallback(() => {
    setSetupStep("verify-password")
    setTwoFactorURI(null)
    setBackupCodes(null)
    setOtpCode("")
    setCopiedCodes(new Set())
  }, [])

  const handleEnable2FA = useCallback(async (password: string) => {
    setIs2FAEnabling(true)
    try {
      const { data, error } = await authClient.twoFactor.enable({
        password,
        issuer: "NextProject",
      })

      if (error) {
        throw new Error(error.message || "Failed to enable 2FA")
      }

      setTwoFactorURI(data?.totpURI ?? null)
      setBackupCodes(data?.backupCodes ?? null)
      setSetupStep("scan-qr")
    } catch (err: any) {
      throw err
    } finally {
      setIs2FAEnabling(false)
    }
  }, [])

  const handleDisable2FA = useCallback(async (password: string) => {
    setIs2FADisabling(true)
    try {
      const { error } = await authClient.twoFactor.disable({
        password,
      })

      if (error) {
        throw new Error(error.message || "Failed to disable 2FA")
      }

      setIs2FAEnabled(false)
    } catch (err: any) {
      throw err
    } finally {
      setIs2FADisabling(false)
    }
  }, [])

  const handleVerify2FA = useCallback(async () => {
    if (!otpCode || otpCode.length !== 6) {
      throw new Error("Please enter a valid 6-digit code")
    }

    try {
      setIsVerifyingOtp(true)
      const { error } = await authClient.twoFactor.verifyTotp({
        code: otpCode,
        trustDevice: true,
      })

      if (error) {
        throw new Error(error.message || "Invalid 2FA code")
      }

      setSetupStep("backup-codes")
    } catch (err: any) {
      setOtpCode("")
      throw err
    } finally {
      setIsVerifyingOtp(false)
    }
  }, [otpCode])

  const completeSetup = useCallback(() => {
    setIs2FAEnabled(true)
    setSetupStep("completed")
    resetSetupFlow()
  }, [resetSetupFlow])

  return (
    <Card>
      <CardHeader>
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex items-start gap-3">
            <Shield className="h-5 w-5 mt-0.5 flex-shrink-0" />
            <div>
              <CardTitle>Two-Factor Authentication</CardTitle>
              <CardDescription>
                Add an extra layer of security to your account with 2FA
              </CardDescription>
            </div>
          </div>
          {isLoading2FAStatus ? (
            <Badge variant="outline" className="w-fit">
              <div className="animate-pulse">Checking...</div>
            </Badge>
          ) : (
            <Badge
              variant={is2FAEnabled ? "default" : "secondary"}
              className="flex items-center gap-1 w-fit"
            >
              {is2FAEnabled ? (
                <>
                  <ShieldCheck className="h-3 w-3" />
                  Enabled
                </>
              ) : (
                <>
                  <ShieldX className="h-3 w-3" />
                  Disabled
                </>
              )}
            </Badge>
          )}
        </div>
      </CardHeader>
      <CardContent>
        {isLoading2FAStatus ? (
          <div className="text-center py-8">
            <div className="animate-pulse space-y-2">
              <div className="h-4 bg-muted rounded w-1/3 mx-auto"></div>
              <div className="h-3 bg-muted rounded w-1/2 mx-auto"></div>
            </div>
          </div>
        ) : is2FAEnabled ? (
          <TwoFactorEnabled 
            onDisable={handleDisable2FA}
            isDisabling={is2FADisabling}
          />
        ) : (
          <TwoFactorSetup
            setupStep={setupStep}
            isEnabling={is2FAEnabling}
            twoFactorURI={twoFactorURI}
            backupCodes={backupCodes}
            otpCode={otpCode}
            setOtpCode={setOtpCode}
            isVerifyingOtp={isVerifyingOtp}
            copiedCodes={copiedCodes}
            setCopiedCodes={setCopiedCodes}
            onEnable={handleEnable2FA}
            onVerify={handleVerify2FA}
            onComplete={completeSetup}
            onReset={resetSetupFlow}
          />
        )}
      </CardContent>
    </Card>
  )
}