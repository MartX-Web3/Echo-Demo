import { cn } from '@/lib/utils'
import { SkipForward } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface SpeedControlsProps {
  speed: number
  onSpeedChange: (speed: number) => void
  onSkipToEnd: () => void
  disabled?: boolean
}

export function SpeedControls({ speed, onSpeedChange, onSkipToEnd, disabled }: SpeedControlsProps) {
  const speeds = [1, 2, 4]

  return (
    <div className="flex items-center justify-center gap-2">
      <div className="inline-flex rounded-lg border p-0.5 bg-muted/30">
        {speeds.map((s) => (
          <button
            key={s}
            onClick={() => onSpeedChange(s)}
            disabled={disabled}
            className={cn(
              "px-3 py-1 text-xs font-medium rounded-md transition-all",
              speed === s
                ? "bg-background shadow-sm"
                : "text-muted-foreground hover:text-foreground",
              disabled && "opacity-50 cursor-not-allowed"
            )}
          >
            {s}x
          </button>
        ))}
      </div>

      <Button
        variant="outline"
        size="sm"
        onClick={onSkipToEnd}
        disabled={disabled}
        className="gap-1.5"
      >
        <SkipForward className="h-3.5 w-3.5" />
        Skip
      </Button>
    </div>
  )
}
