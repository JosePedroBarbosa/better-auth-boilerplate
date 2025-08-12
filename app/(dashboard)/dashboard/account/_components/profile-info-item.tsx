import { LucideIcon } from "lucide-react"

interface ProfileInfoItemProps {
  label: string
  value: string
  icon?: LucideIcon
}

export function ProfileInfoItem({ 
  label, 
  value, 
  icon: Icon 
}: ProfileInfoItemProps) {
  return (
    <div className="flex items-center justify-between py-2">
      <span className="text-sm font-medium flex items-center gap-2">
        {Icon && <Icon className="h-4 w-4 text-muted-foreground" />}
        {label}
      </span>
      <span className="text-sm text-muted-foreground text-right">
        {value}
      </span>
    </div>
  )
}