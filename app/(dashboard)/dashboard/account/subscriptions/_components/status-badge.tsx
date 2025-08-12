import { Badge } from "@/components/ui/badge"
import { CheckCircle, AlertTriangle, XCircle } from "lucide-react"

interface StatusBadgeProps {
  status: string
  className?: string
}

export function StatusBadge({ status, className = "" }: StatusBadgeProps) {
  const getStatusProps = () => {
    switch (status) {
      case "active":
        return {
          variant: "default" as const,
          icon: CheckCircle,
          color: "text-green-500",
          label: "Active",
        }
      case "past_due":
        return {
          variant: "outline" as const,
          icon: AlertTriangle,
          color: "text-yellow-500",
          label: "Past Due",
        }
      default:
        return {
          variant: "destructive" as const,
          icon: XCircle,
          color: "text-red-500",
          label: "Inactive",
        }
    }
  }

  const { variant, icon: Icon, color, label } = getStatusProps()

  return (
    <Badge variant={variant} className={`flex items-center gap-1 ${className}`}>
      <Icon className={`h-3 w-3 ${color}`} />
      {label}
    </Badge>
  )
}