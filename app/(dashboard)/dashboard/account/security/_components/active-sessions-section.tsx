"use client"

import { useState, useEffect, useCallback } from "react"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Separator } from "@/components/ui/separator"
import { MonitorSmartphone, Info, CheckCircle } from "lucide-react"
import { toast } from "sonner"
import { authClient } from "@/lib/auth-client"

type SessionType = {
  id: string
  token: string
  createdAt: string | Date
  updatedAt: string | Date
  expiresAt: string | Date
  ipAddress?: string | null
  userAgent?: string | null
}

export function ActiveSessionsSection() {
  const [sessions, setSessions] = useState<SessionType[]>([])
  const [currentToken, setCurrentToken] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchAllSessions()
  }, [])

  const fetchAllSessions = async () => {
    try {
      setLoading(true)
      const { data: session } = await authClient.getSession()
      const { data: allSessions } = await authClient.listSessions()
      setSessions(allSessions ?? [])
      setCurrentToken(session?.session?.token || null)
    } catch (err) {
      toast.error("Failed to load sessions.")
    } finally {
      setLoading(false)
    }
  }

  const handleRevoke = useCallback(async (token: string) => {
    try {
      await authClient.revokeSession({ token })
      setSessions((prev) => prev.filter((s) => s.token !== token))
      toast.success("Session successfully revoked!")
    } catch {
      toast.error("Failed to revoke session.")
    }
  }, [])

  const handleRevokeOtherSessions = useCallback(async () => {
    try {
      await authClient.revokeOtherSessions()
      setSessions((prev) => prev.filter((s) => s.token === currentToken))
      toast.success("Other sessions have been revoked.")
    } catch {
      toast.error("Failed to revoke other sessions.")
    }
  }, [currentToken])

  const handleRevokeAll = useCallback(async () => {
    try {
      await authClient.revokeSessions()
      setSessions([])
      toast.success("All sessions have been revoked!")
      // Force refresh/logout
      window.location.reload()
    } catch {
      toast.error("Failed to revoke all sessions.")
    }
  }, [])

  return (
    <Card>
      <CardHeader>
        <div className="flex items-start gap-3">
          <MonitorSmartphone className="h-5 w-5 mt-0.5 flex-shrink-0" />
          <div>
            <CardTitle>Active Sessions</CardTitle>
            <CardDescription className="mt-2">
              Manage devices logged into your account.
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <Alert className="mb-4">
          <Info className="h-4 w-4" />
          <AlertDescription>
            See all devices with active sessions. Revoke if you do not
            recognize any.
          </AlertDescription>
        </Alert>

        {loading ? (
          <div className="text-center py-8">
            <div className="animate-pulse space-y-2">
              <div className="h-4 bg-muted rounded w-1/3 mx-auto"></div>
              <div className="h-3 bg-muted rounded w-1/2 mx-auto"></div>
            </div>
          </div>
        ) : sessions.length === 0 ? (
          <Alert>
            <CheckCircle className="h-4 w-4" />
            <AlertDescription>No active sessions found.</AlertDescription>
          </Alert>
        ) : (
          <div className="space-y-3">
            {sessions.map((session) => (
              <div
                key={session.id}
                className="border rounded-xl p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between"
              >
                <div className="space-y-1 text-sm">
                  <div className="font-medium flex items-center">
                    {session.userAgent || "Unknown"}
                    {session.token === currentToken && (
                      <Badge
                        variant="outline"
                        className="ml-16 px-2 py-0.5 text-xs"
                      >
                        Current Session
                      </Badge>
                    )}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    IP: {session.ipAddress || "N/A"}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    Start: {new Date(session.createdAt).toLocaleString("en-US")}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    Expires: {new Date(session.expiresAt).toLocaleString("en-US")}
                  </div>
                </div>
                <div>
                  {session.token !== currentToken && (
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => handleRevoke(session.token)}
                      className="cursor-pointer"
                    >
                      Revoke
                    </Button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        {sessions.length > 1 && (
          <>
            <Separator className="my-6" />
            <div className="flex flex-col md:flex-row gap-3">
              <Button
                variant="outline"
                onClick={handleRevokeOtherSessions}
                className="flex-1 cursor-pointer"
              >
                Revoke Other Sessions
              </Button>
              <Button
                variant="destructive"
                onClick={handleRevokeAll}
                className="flex-1 cursor-pointer"
              >
                Revoke All Sessions (This will also log you out)
              </Button>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  )
}