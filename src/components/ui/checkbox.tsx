import * as React from "react"
import { cn } from "@/lib/utils"
import { Check } from "lucide-react"

interface CheckboxProps {
  id: string
  checked: boolean
  onChange: (checked: boolean) => void
  disabled?: boolean
  children?: React.ReactNode
  className?: string
}

export function Checkbox({ id, checked, onChange, disabled, children, className }: CheckboxProps) {
  return (
    <label
      htmlFor={id}
      className={cn(
        "flex items-start gap-3 cursor-pointer",
        disabled && "opacity-50 cursor-not-allowed",
        className
      )}
    >
      <div className="relative flex items-center justify-center mt-0.5">
        <input
          type="checkbox"
          id={id}
          checked={checked}
          disabled={disabled}
          onChange={(e) => !disabled && onChange(e.target.checked)}
          className="sr-only"
        />
        <div
          className={cn(
            "h-4 w-4 rounded border flex items-center justify-center transition-colors",
            checked && !disabled && "bg-primary border-primary",
            checked && disabled && "bg-muted border-muted",
            !checked && "border-muted-foreground/50 bg-background"
          )}
        >
          {checked && (
            <Check className={cn(
              "h-3 w-3",
              disabled ? "text-muted-foreground" : "text-primary-foreground"
            )} />
          )}
        </div>
      </div>
      {children}
    </label>
  )
}
