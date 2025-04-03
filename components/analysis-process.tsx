"use client"
import { CheckCircle2, Link, AlertTriangle } from "lucide-react"
import { cn } from "@/lib/utils"
import { Card } from "@/components/ui/card"

interface AnalysisProcessProps {
  isAnalyzing: boolean
  isComplete: boolean
  processSteps: ProcessStep[]
  currentStepIndex: number
}

export interface ProcessStep {
  id: string
  icon: any
  title: string
  description: string
  status: "pending" | "processing" | "success" | "error" | "skipped"
  details?: string
  links?: Array<{
    url: string
    description: string
    status?: "pending" | "success" | "error"
  }>
}

export function AnalysisProcess({ isAnalyzing, isComplete, processSteps, currentStepIndex }: AnalysisProcessProps) {
  return (
    <div className="hidden lg:flex flex-col h-full justify-center space-y-8 p-10 border-r bg-slate-50">
      <div className="text-center mb-8">
        <h3 className="text-xl font-medium text-slate-900 mb-2">Analysis Process</h3>
        <p className="text-base text-slate-600">Watching the AI analyze Terms of Service</p>
      </div>

      <div className="space-y-10 relative">
        {/* Vertical line connecting steps */}
        <div className="absolute left-6 top-8 bottom-8 w-0.5 bg-slate-200"></div>

        {processSteps.map((step, index) => {
          const StepIcon = step.icon
          const isActive = currentStepIndex >= index
          const isCurrentStep = currentStepIndex === index

          return (
            <div key={step.id} className="space-y-4">
              <div
                className={cn(
                  "flex items-start gap-5 transition-all duration-500",
                  isActive ? "opacity-100" : "opacity-40",
                )}
              >
                <div className="relative z-10">
                  <div
                    className={cn(
                      "flex items-center justify-center w-14 h-14 rounded-full transition-all duration-500",
                      step.status === "success"
                        ? "bg-green-600 text-white"
                        : step.status === "error"
                          ? "bg-red-600 text-white"
                          : step.status === "skipped"
                            ? "bg-amber-500 text-white"
                            : isActive
                              ? "bg-slate-900 text-white"
                              : "bg-slate-100 text-slate-400",
                      isCurrentStep && isAnalyzing && "animate-pulse",
                    )}
                  >
                    <StepIcon className="h-6 w-6" />
                  </div>
                  {step.status === "success" && (
                    <CheckCircle2 className="absolute -bottom-1 -right-1 h-6 w-6 text-green-500 bg-white rounded-full" />
                  )}
                  {step.status === "error" && (
                    <AlertTriangle className="absolute -bottom-1 -right-1 h-6 w-6 text-red-500 bg-white rounded-full" />
                  )}
                </div>

                <div className="pt-2">
                  <h4
                    className={cn(
                      "font-medium text-lg transition-colors",
                      isActive ? "text-slate-900" : "text-slate-500",
                    )}
                  >
                    {step.title}
                  </h4>
                  <p className={cn("text-base transition-colors mt-1", isActive ? "text-slate-600" : "text-slate-400")}>
                    {step.description}
                  </p>
                </div>
              </div>

              {/* Details and links section */}
              {isActive && step.details && (
                <div className="ml-20 mt-3">
                  <p className="text-sm text-slate-600 italic">{step.details}</p>
                </div>
              )}

              {isActive && step.links && step.links.length > 0 && (
                <div className="ml-20 mt-3 space-y-3">
                  {step.links.map((link, linkIndex) => (
                    <Card
                      key={linkIndex}
                      className={cn(
                        "p-3 text-sm border",
                        link.status === "success"
                          ? "border-green-200 bg-green-50"
                          : link.status === "error"
                            ? "border-red-200 bg-red-50"
                            : "border-slate-200 bg-slate-50",
                      )}
                    >
                      <div className="flex items-start gap-3">
                        <Link
                          className={cn(
                            "h-5 w-5 flex-shrink-0 mt-0.5",
                            link.status === "success"
                              ? "text-green-600"
                              : link.status === "error"
                                ? "text-red-600"
                                : "text-slate-600",
                          )}
                        />
                        <div>
                          <div className="font-medium text-slate-900 break-all">
                            {link.url.length > 50 ? `${link.url.substring(0, 47)}...` : link.url}
                          </div>
                          <div className="text-slate-600 mt-2 flex items-center gap-2">
                            {link.description}
                            {link.status === "success" && (
                              <span className="text-green-600 flex items-center gap-1">
                                <CheckCircle2 className="h-4 w-4" /> Found valid content
                              </span>
                            )}
                            {link.status === "error" && (
                              <span className="text-red-600 flex items-center gap-1">
                                <AlertTriangle className="h-4 w-4" /> Failed to extract
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
              )}
            </div>
          )
        })}
      </div>

      {isComplete && (
        <div className="text-center text-base text-green-600 font-medium pt-6 animate-fadeIn">
          Analysis complete! Ask questions about the Terms of Service.
        </div>
      )}
    </div>
  )
}

