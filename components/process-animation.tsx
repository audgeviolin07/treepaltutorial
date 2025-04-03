"use client"

import { useEffect, useState } from "react"
import { Bot, Globe, FileText, Search, Zap, CheckCircle2 } from "lucide-react"
import { cn } from "@/lib/utils"

interface ProcessAnimationProps {
  isAnalyzing: boolean
  isComplete: boolean
}

export function ProcessAnimation({ isAnalyzing, isComplete }: ProcessAnimationProps) {
  const [currentStep, setCurrentStep] = useState(0)
  const [animationComplete, setAnimationComplete] = useState(false)

  // Reset and start animation when analysis begins
  useEffect(() => {
    if (isAnalyzing) {
      setCurrentStep(0)
      setAnimationComplete(false)

      // Start the animation sequence
      const interval = setInterval(() => {
        setCurrentStep((prev) => {
          const nextStep = prev + 1
          if (nextStep >= steps.length) {
            clearInterval(interval)
            return prev
          }
          return nextStep
        })
      }, 2000) // Advance to next step every 2 seconds

      return () => clearInterval(interval)
    }
  }, [isAnalyzing])

  // Complete animation when analysis is done
  useEffect(() => {
    if (isComplete && !animationComplete) {
      // Ensure all steps are shown as complete
      setCurrentStep(steps.length - 1)
      setAnimationComplete(true)
    }
  }, [isComplete, animationComplete])

  const steps = [
    {
      icon: Globe,
      title: "Accessing Website",
      description: "Connecting to the target website",
    },
    {
      icon: Search,
      title: "Finding Terms",
      description: "Locating Terms of Service pages",
    },
    {
      icon: FileText,
      title: "Extracting Content",
      description: "Parsing and cleaning text content",
    },
    {
      icon: Zap,
      title: "AI Analysis",
      description: "Processing with AI for understanding",
    },
    {
      icon: Bot,
      title: "Ready",
      description: "AI assistant ready to answer questions",
    },
  ]

  return (
    <div className="hidden lg:flex flex-col h-full justify-center space-y-8 pr-8 border-r">
      <div className="text-center mb-6">
        <h3 className="text-lg font-medium text-slate-900">How It Works</h3>
        <p className="text-sm text-slate-500">The process of analyzing Terms of Service</p>
      </div>

      <div className="space-y-8 relative">
        {/* Vertical line connecting steps */}
        <div className="absolute left-6 top-6 bottom-6 w-0.5 bg-slate-200"></div>

        {steps.map((step, index) => {
          const StepIcon = step.icon
          const isActive = currentStep >= index
          const isCurrentStep = currentStep === index

          return (
            <div
              key={index}
              className={cn(
                "flex items-start gap-4 transition-all duration-500",
                isActive ? "opacity-100" : "opacity-40",
              )}
            >
              <div className="relative z-10">
                <div
                  className={cn(
                    "flex items-center justify-center w-12 h-12 rounded-full transition-all duration-500",
                    isActive ? "bg-slate-900 text-white" : "bg-slate-100 text-slate-400",
                    isCurrentStep && isAnalyzing && "animate-pulse",
                  )}
                >
                  <StepIcon className="h-5 w-5" />
                </div>
                {isActive && index === steps.length - 1 && isComplete && (
                  <CheckCircle2 className="absolute -bottom-1 -right-1 h-5 w-5 text-green-500 bg-white rounded-full" />
                )}
              </div>

              <div className="pt-2">
                <h4 className={cn("font-medium transition-colors", isActive ? "text-slate-900" : "text-slate-500")}>
                  {step.title}
                </h4>
                <p className={cn("text-sm transition-colors", isActive ? "text-slate-600" : "text-slate-400")}>
                  {step.description}
                </p>
              </div>
            </div>
          )
        })}
      </div>

      {isComplete && (
        <div className="text-center text-sm text-green-600 font-medium pt-4 animate-fadeIn">
          Analysis complete! Ask questions about the Terms of Service.
        </div>
      )}
    </div>
  )
}

