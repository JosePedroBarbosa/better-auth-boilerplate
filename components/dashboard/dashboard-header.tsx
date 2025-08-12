"use client"

import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"
import React from "react"

interface DashboardHeaderProps {
  title: string
  description?: string
  backHref?: string
  backLabel?: string
}

export function DashboardHeader({
  title,
  description,
  backHref = "/dashboard",
  backLabel = "Back to Dashboard",
}: DashboardHeaderProps) {
  return (
    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
      <div className="space-y-1">
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">
          {title}
        </h1>
        {description && (
          <p className="text-muted-foreground">
            {description}
          </p>
        )}
      </div>

      {backHref && (
        <div className="flex items-center gap-3">
          <Link href={backHref}>
            <Button variant="outline" className="cursor-pointer">
              <ArrowLeft className="h-4 w-4 mr-2" />
              {backLabel}
            </Button>
          </Link>
        </div>
      )}
    </div>
  )
}