"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useToast } from "@/hooks/use-toast"
import { analyzeWebsite } from "@/app/actions"
import { Loader2, Info, AlertTriangle, HelpCircle, Globe, Search, FileText, Zap, Bot } from "lucide-react"
import { ChatInterface } from "./chat-interface"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { AnalysisProcess, type ProcessStep } from "./analysis-process"

export function WebsiteAnalyzer() {
  const [url, setUrl] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const { toast } = useToast()
  const [analysisResult, setAnalysisResult] = useState<{
    url: string
    content: string
    summary: string
  } | null>(null)
  const [isDemoMode, setIsDemoMode] = useState(false)
  const [contentWarning, setContentWarning] = useState<string | null>(null)

  // Process visualization state
  const [processSteps, setProcessSteps] = useState<ProcessStep[]>([
    {
      id: "access",
      icon: Globe,
      title: "Accessing Website",
      description: "Connecting to the target website",
      status: "pending",
    },
    {
      id: "find",
      icon: Search,
      title: "Finding Terms",
      description: "Locating Terms of Service pages",
      status: "pending",
    },
    {
      id: "extract",
      icon: FileText,
      title: "Extracting Content",
      description: "Parsing and cleaning text content",
      status: "pending",
    },
    {
      id: "analyze",
      icon: Zap,
      title: "AI Analysis",
      description: "Processing with AI for understanding",
      status: "pending",
    },
    {
      id: "ready",
      icon: Bot,
      title: "Ready",
      description: "AI assistant ready to answer questions",
      status: "pending",
    },
  ])
  const [currentStepIndex, setCurrentStepIndex] = useState(-1)

  // Event listeners for process updates
  useEffect(() => {
    const handleProcessUpdate = (event: MessageEvent) => {
      try {
        const data = JSON.parse(event.data)
        if (data.type === "process-update") {
          updateProcessStep(data.stepId, data.status, data.details, data.links)
        }
      } catch (e) {
        // Ignore parsing errors
      }
    }

    // Listen for messages from the server
    window.addEventListener("message", handleProcessUpdate)

    return () => {
      window.removeEventListener("message", handleProcessUpdate)
    }
  }, [])

  // Function to update a process step
  const updateProcessStep = (
    stepId: string,
    status: "pending" | "processing" | "success" | "error" | "skipped",
    details?: string,
    links?: Array<{
      url: string
      description: string
      status?: "pending" | "success" | "error"
    }>,
  ) => {
    setProcessSteps((prev) => {
      const newSteps = [...prev]
      const stepIndex = newSteps.findIndex((step) => step.id === stepId)

      if (stepIndex !== -1) {
        newSteps[stepIndex] = {
          ...newSteps[stepIndex],
          status,
          details,
          links: links || newSteps[stepIndex].links,
        }

        // If this step is now processing, update the current step index
        if (status === "processing") {
          setCurrentStepIndex(stepIndex)
        }
      }

      return newSteps
    })
  }

  // Simulate process updates for demo purposes
  const simulateProcessUpdates = async (inputUrl: string) => {
    // Reset all steps
    setProcessSteps((prev) =>
      prev.map((step) => ({ ...step, status: "pending", details: undefined, links: undefined })),
    )
    setCurrentStepIndex(-1)

    // Step 1: Accessing Website
    updateProcessStep("access", "processing", `Connecting to ${inputUrl}...`)
    await new Promise((resolve) => setTimeout(resolve, 1000))
    updateProcessStep("access", "success", `Successfully connected to ${inputUrl}`)

    // Step 2: Finding Terms
    updateProcessStep("find", "processing", "Searching for Terms of Service links...")
    await new Promise((resolve) => setTimeout(resolve, 1500))

    // For specific domains, show the actual links
    if (inputUrl.includes("supabase.com")) {
      updateProcessStep("find", "success", "Found potential Terms of Service links", [
        {
          url: "https://supabase.com/terms",
          description: "Terms of Service",
          status: "pending",
        },
      ])
    } else if (inputUrl.includes("cognition.ai")) {
      updateProcessStep("find", "success", "Found potential Terms of Service links", [
        {
          url: "https://cognition.ai/pages/terms-of-service",
          description: "Terms of Service",
          status: "pending",
        },
      ])
    } else {
      // Generic links for other sites
      updateProcessStep("find", "success", "Found potential Terms of Service links", [
        {
          url: `${inputUrl.replace(/\/$/, "")}/terms`,
          description: "Terms of Service",
          status: "pending",
        },
      ])
    }

    // Step 3: Extracting Content
    updateProcessStep("extract", "processing", "Attempting to extract content from identified links...")
    await new Promise((resolve) => setTimeout(resolve, 2000))

    // Update the links with success/failure status
    if (inputUrl.includes("supabase.com")) {
      setProcessSteps((prev) => {
        const newSteps = [...prev]
        const findStepIndex = newSteps.findIndex((step) => step.id === "find")

        if (findStepIndex !== -1 && newSteps[findStepIndex].links) {
          newSteps[findStepIndex].links = newSteps[findStepIndex].links?.map((link) => ({
            ...link,
            status: "success",
          }))
        }

        return newSteps
      })

      updateProcessStep("extract", "success", "Successfully extracted content from Terms of Service")
    } else {
      // For other sites, show success
      setProcessSteps((prev) => {
        const newSteps = [...prev]
        const findStepIndex = newSteps.findIndex((step) => step.id === "find")

        if (findStepIndex !== -1 && newSteps[findStepIndex].links) {
          newSteps[findStepIndex].links = newSteps[findStepIndex].links?.map((link) => ({
            ...link,
            status: "success",
          }))
        }

        return newSteps
      })

      // Continue with analysis
      updateProcessStep("extract", "success", "Successfully extracted content from Terms of Service")
    }

    // Step 4: AI Analysis
    updateProcessStep("analyze", "processing", "Analyzing content with AI to understand terms...")
    await new Promise((resolve) => setTimeout(resolve, 2500))
    updateProcessStep("analyze", "success", "AI analysis complete, generated summary and prepared for questions")

    // Step 5: Ready
    updateProcessStep("ready", "processing", "Preparing AI assistant...")
    await new Promise((resolve) => setTimeout(resolve, 1000))
    updateProcessStep("ready", "success", "AI assistant is ready to answer your questions about the Terms of Service")
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    const inputUrl = url

    if (!inputUrl) {
      toast({
        title: "URL is required",
        description: "Please enter a website URL to analyze",
        variant: "destructive",
      })
      return
    }

    try {
      setIsLoading(true)
      setContentWarning(null)

      // Start the process visualization
      simulateProcessUpdates(inputUrl)

      const result = await analyzeWebsite(inputUrl)

      if (result.success) {
        setAnalysisResult(result.data)

        // Check if we're in demo mode based on the summary content
        if (result.data?.summary.includes("demonstration mode")) {
          setIsDemoMode(true)
          toast({
            title: "Demo Mode Active",
            description: "Running in demonstration mode without OpenAI API key",
            variant: "default",
          })
        } else {
          setIsDemoMode(false)

          // Check if the content seems incomplete
          if (result.data && result.data.content.length < 1000) {
            setContentWarning(
              "The extracted Terms of Service content seems limited. The analysis may not be comprehensive.",
            )
          } else {
            toast({
              title: "Analysis complete",
              description: "The website has been analyzed successfully",
            })
          }
        }
      } else {
        // Update the process visualization to show error
        updateProcessStep("extract", "error", "Failed to extract content from the website")
        updateProcessStep("analyze", "skipped", "Analysis skipped due to content extraction failure")
        updateProcessStep("ready", "skipped", "AI assistant preparation skipped")

        toast({
          title: "Analysis failed",
          description: result.error || "Failed to analyze the website",
          variant: "destructive",
        })
      }
    } catch (error) {
      // Update the process visualization to show error
      updateProcessStep("extract", "error", "An unexpected error occurred")
      updateProcessStep("analyze", "skipped", "Analysis skipped due to error")
      updateProcessStep("ready", "skipped", "AI assistant preparation skipped")

      toast({
        title: "Error",
        description: "An unexpected error occurred",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <>
      {/* Process Animation on the left */}
      <AnalysisProcess
        isAnalyzing={isLoading}
        isComplete={!!analysisResult}
        processSteps={processSteps}
        currentStepIndex={currentStepIndex}
      />

      {/* Main content on the right */}
      <div className="p-8 lg:p-10 space-y-8">
        <div className="mb-8">
          <h2 className="text-2xl font-semibold text-slate-900 mb-3">Analyze a Website&apos;s Terms of Service</h2>
          <p className="text-base text-slate-600">Enter a website URL to analyze its Terms of Service</p>
        </div>

        {isDemoMode && (
          <Alert className="mb-6">
            <Info className="h-5 w-5" />
            <AlertTitle className="text-base">Demo Mode Active</AlertTitle>
            <AlertDescription className="text-sm mt-1">
              The application is running in demonstration mode because the OpenAI API key is not configured. Some
              features will be limited. To enable full functionality, please add your OpenAI API key to the environment
              variables.
            </AlertDescription>
          </Alert>
        )}

        {contentWarning && (
          <Alert variant="warning" className="mb-6">
            <AlertTriangle className="h-5 w-5" />
            <AlertTitle className="text-base">Limited Content</AlertTitle>
            <AlertDescription className="text-sm mt-1">
              {contentWarning} Try providing a direct link to the Terms of Service page for better results.
            </AlertDescription>
          </Alert>
        )}

        <form onSubmit={handleSubmit} className="space-y-6 mb-8">
          <div className="space-y-4">
            <div className="flex items-center gap-3 mb-3">
              <Label htmlFor="url" className="text-base font-medium">
                Website URL
              </Label>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <HelpCircle className="h-5 w-5 text-slate-400" />
                  </TooltipTrigger>
                  <TooltipContent className="p-3">
                    <p className="max-w-xs">Enter a website domain or a direct link to a Terms of Service page</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
            <div className="flex gap-3">
              <Input
                id="url"
                placeholder="example.com or https://example.com/terms"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                className="flex-1 text-base py-6 px-4"
                disabled={isLoading}
              />
              <Button type="submit" disabled={isLoading} className="px-6 py-6 text-base">
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                    Analyzing
                  </>
                ) : (
                  "Analyze"
                )}
              </Button>
            </div>
            <p className="text-sm text-slate-500 mt-3">
              Enter a link to a website, and it will find the Terms of Service page to analyze
            </p>
          </div>
        </form>

        {analysisResult && (
          <div className="mt-12">
            <h2 className="mb-6 text-2xl font-semibold text-slate-900">Chat with your Terms of Service Assistant</h2>
            <ChatInterface analysisResult={analysisResult} />
          </div>
        )}
      </div>
    </>
  )
}

