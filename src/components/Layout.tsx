import { useLocation } from 'react-router-dom'
import { cn } from '@/lib/utils'
import { Check } from 'lucide-react'
import type { ReactNode } from 'react'

interface LayoutProps {
  children: ReactNode
}

const steps = [
  { path: '/', label: 'Connect' },
  { path: '/policy', label: 'Define Authority' },
  { path: '/dashboard', label: 'Watch AI Operate' },
]

export function Layout({ children }: LayoutProps) {
  const location = useLocation()
  const currentStepIndex = steps.findIndex(s => s.path === location.pathname)

  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto max-w-5xl px-4 py-8">
        {/* Step Indicator */}
        <nav className="mb-8">
          <ol className="flex items-center justify-center gap-2">
            {steps.map((step, index) => {
              const isCompleted = index < currentStepIndex
              const isCurrent = index === currentStepIndex

              return (
                <li key={step.path} className="flex items-center">
                  {index > 0 && (
                    <div
                      className={cn(
                        "w-12 h-0.5 mx-2",
                        isCompleted ? "bg-primary" : "bg-muted"
                      )}
                    />
                  )}
                  <div className="flex items-center gap-2">
                    <div
                      className={cn(
                        "flex h-8 w-8 items-center justify-center rounded-full text-sm font-medium",
                        isCompleted && "bg-primary text-primary-foreground",
                        isCurrent && "bg-primary text-primary-foreground",
                        !isCompleted && !isCurrent && "bg-muted text-muted-foreground"
                      )}
                    >
                      {isCompleted ? (
                        <Check className="h-4 w-4" />
                      ) : (
                        index + 1
                      )}
                    </div>
                    <span
                      className={cn(
                        "text-sm font-medium hidden sm:block",
                        isCurrent && "text-foreground",
                        !isCurrent && "text-muted-foreground"
                      )}
                    >
                      {step.label}
                    </span>
                  </div>
                </li>
              )
            })}
          </ol>
        </nav>

        {/* Page Content */}
        {children}
      </div>
    </div>
  )
}
