import { Calendar, LucideIcon } from "lucide-react"

interface SubscriptionInfoItemProps {
  label: string
  value: string
  valueColor?: string
  icon?: LucideIcon
}

export function SubscriptionInfoItem({
  label,
  value,
  valueColor = "text-muted-foreground",
  icon: Icon = Calendar,
}: SubscriptionInfoItemProps) {
  return (
    <div className="flex items-center justify-between py-3">
      <span className="text-sm font-medium flex items-center gap-2">
        <Icon className="h-4 w-4 text-muted-foreground" />
        {label}
      </span>
      <span className={`text-sm font-medium text-right ${valueColor}`}>
        {value}
      </span>
    </div>
  )
}