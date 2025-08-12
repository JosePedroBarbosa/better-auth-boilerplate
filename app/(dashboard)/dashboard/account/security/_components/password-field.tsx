import { Input } from "@/components/ui/input"
import { Eye, EyeOff, AlertTriangle, Check, X } from "lucide-react"

interface PasswordFieldProps {
  label: string
  name: string
  placeholder: string
  register: any
  error?: any
  showPassword: boolean
  onToggleShow: () => void
  autoComplete: string
  showStrength?: boolean
  watchedValue?: string
}

// Componente para validação de senha em tempo real
function PasswordStrengthIndicator({ password }: { password: string }) {
  const requirements = [
    { regex: /.{6,}/, text: "At least 6 characters" },
    { regex: /[A-Z]/, text: "One uppercase letter" },
    { regex: /[a-z]/, text: "One lowercase letter" },
    { regex: /\d/, text: "One number" },
    { regex: /[^A-Za-z0-9]/, text: "One special character" },
  ]

  if (!password) return null

  return (
    <div className="mt-3 space-y-2">
      <p className="text-sm font-medium">Password requirements:</p>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-1">
        {requirements.map((req, index) => {
          const isValid = req.regex.test(password)
          return (
            <div key={index} className="flex items-center gap-2 text-xs">
              {isValid ? (
                <Check className="h-3 w-3 text-green-600" />
              ) : (
                <X className="h-3 w-3 text-red-400" />
              )}
              <span
                className={isValid ? "text-green-600" : "text-muted-foreground"}
              >
                {req.text}
              </span>
            </div>
          )
        })}
      </div>
    </div>
  )
}

export function PasswordField({
  label,
  name,
  placeholder,
  register,
  error,
  showPassword,
  onToggleShow,
  autoComplete,
  showStrength = false,
  watchedValue = "",
}: PasswordFieldProps) {
  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium">{label}</label>
      <div className="relative">
        <Input
          type={showPassword ? "text" : "password"}
          placeholder={placeholder}
          {...register(name)}
          aria-invalid={!!error}
          required
          autoComplete={autoComplete}
          className="pr-10"
        />
        <button
          type="button"
          onClick={onToggleShow}
          className="cursor-pointer absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 rounded-sm"
          tabIndex={-1}
          aria-label={showPassword ? "Hide password" : "Show password"}
        >
          {showPassword ? (
            <EyeOff className="w-4 h-4" />
          ) : (
            <Eye className="w-4 h-4" />
          )}
        </button>
      </div>
      {showStrength && <PasswordStrengthIndicator password={watchedValue} />}
      {error && (
        <p
          className="text-destructive text-sm flex items-center gap-1"
          role="alert"
        >
          <AlertTriangle className="h-3 w-3" />
          {error.message}
        </p>
      )}
    </div>
  )
}