import { Check } from 'lucide-react'

interface Step {
  title: string
  description: string
}

interface StepsProps {
  steps: Step[]
  currentStep: number
}

export function Steps({ steps, currentStep }: StepsProps) {
  return (
    <div className="space-y-4 pb-8">
      {steps.map((step, index) => (
        <div key={step.title} className="flex items-center">
          <div className="relative flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full border-2 border-gray-300 dark:border-gray-700">
            {index < currentStep ? (
              <Check className="h-6 w-6 text-primary" />
            ) : index === currentStep ? (
              <div className="h-2.5 w-2.5 rounded-full bg-primary" />
            ) : null}
          </div>
          <div className="ml-4 min-w-0 flex-1">
            <h3 className="text-sm font-medium">{step.title}</h3>
            <p className="text-sm text-muted-foreground">{step.description}</p>
          </div>
        </div>
      ))}
    </div>
  )
}

