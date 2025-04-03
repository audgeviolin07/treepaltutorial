"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Card } from "@/components/ui/card"
import { Send, FileText, ChevronDown, ChevronUp } from "lucide-react"
import { cn } from "@/lib/utils"
import { askAboutTerms } from "@/app/actions"
import { SuggestedQuestions } from "@/components/suggested-questions"

type AnalysisResult = {
  url: string
  content: string
  summary: string
}

type ChatInterfaceProps = {
  analysisResult: AnalysisResult
}

type Message = {
  id: string
  content: string
  role: "user" | "assistant"
}

export function ChatInterface({ analysisResult }: ChatInterfaceProps) {
  const [showFullSummary, setShowFullSummary] = useState(false)
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "welcome",
      content: `I've analyzed the Terms of Service for ${analysisResult.url}. Here's a brief summary: ${analysisResult.summary.substring(0, 200)}... Ask me specific questions about the terms and conditions.`,
      role: "assistant",
    },
  ])
  const [input, setInput] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  const handleSelectQuestion = (question: string) => {
    setInput(question)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!input.trim() || isLoading) return

    const userMessage: Message = {
      id: Date.now().toString(),
      content: input,
      role: "user",
    }

    setMessages((prev) => [...prev, userMessage])
    setInput("")
    setIsLoading(true)

    try {
      const response = await askAboutTerms(input, analysisResult)

      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: response.message,
        role: "assistant",
      }

      setMessages((prev) => [...prev, assistantMessage])
    } catch (error) {
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: "Sorry, I encountered an error processing your request. Please try again.",
        role: "assistant",
      }

      setMessages((prev) => [...prev, errorMessage])
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="flex h-[800px] flex-col">
      <div className="mb-6">
        <Button
          variant="outline"
          className="gap-2 mb-3 w-full justify-between"
          onClick={() => setShowFullSummary(!showFullSummary)}
        >
          <div className="flex items-center gap-2">
            <FileText className="h-4 w-4" />
            <span>Full Summary of the Terms</span>
          </div>
          {showFullSummary ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
        </Button>

        {showFullSummary && (
          <Card className="p-6 mt-2 bg-slate-50">
            <div className="mb-3">
              <h3 className="text-lg font-medium text-slate-900">Terms of Service Summary</h3>
              <p className="text-sm text-slate-500">Full analysis of {analysisResult.url}</p>
            </div>
            <div className="relative mt-4 border rounded-md border-slate-200 bg-white">
              <ScrollArea className="max-h-[350px] overflow-auto p-4">
                <div className="text-base leading-relaxed text-slate-800 pr-2">
                  {analysisResult.summary.split("\n").map((paragraph, index) => (
                    <p key={index} className={index > 0 ? "mt-4" : ""}>
                      {paragraph}
                    </p>
                  ))}
                </div>
              </ScrollArea>
            </div>
          </Card>
        )}
      </div>

      <Card className="flex-1 overflow-hidden rounded-lg border shadow-sm">
        <ScrollArea className="h-full p-10">
          <div className="space-y-8 pb-6">
            {messages.map((message) => (
              <div key={message.id} className={cn("flex items-start gap-5", message.role === "user" && "justify-end")}>
                {message.role === "assistant" && (
                  <div className="h-8 w-8 rounded-full bg-slate-800 flex-shrink-0 self-start mt-1 ring-2 ring-slate-200" />
                )}
                <div
                  className={cn(
                    "rounded-lg px-5 py-3 max-w-[80%] text-base",
                    message.role === "assistant" ? "bg-slate-100 text-slate-900" : "bg-slate-900 text-white",
                  )}
                >
                  {message.content}
                </div>
                {message.role === "user" && (
                  <div className="h-8 w-8 rounded-full bg-slate-900 flex-shrink-0 self-start mt-1 ring-2 ring-slate-200" />
                )}
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>
        </ScrollArea>
      </Card>

      <SuggestedQuestions content={analysisResult.content} onSelectQuestion={handleSelectQuestion} />

      <form onSubmit={handleSubmit} className="mt-8 flex gap-3">
        <Input
          placeholder="Ask about the Terms of Service..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          disabled={isLoading}
          className="flex-1 text-base py-6 px-4"
        />
        <Button type="submit" size="icon" disabled={isLoading} className="h-14 w-14">
          <Send className="h-5 w-5" />
          <span className="sr-only">Send message</span>
        </Button>
      </form>
    </div>
  )
}

