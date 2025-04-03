"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Lightbulb } from "lucide-react"
import { generateSuggestedQuestions } from "@/app/actions"

interface SuggestedQuestionsProps {
  content: string
  onSelectQuestion: (question: string) => void
}

export function SuggestedQuestions({ content, onSelectQuestion }: SuggestedQuestionsProps) {
  const [questions, setQuestions] = useState<string[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    async function loadQuestions() {
      try {
        setIsLoading(true)
        const suggestedQuestions = await generateSuggestedQuestions(content)
        setQuestions(suggestedQuestions)
      } catch (error) {
        console.error("Failed to load suggested questions:", error)
        // Set default questions on error
        setQuestions([
          "What are my obligations under these terms?",
          "Can I terminate my account?",
          "What happens if I violate the terms?",
          "What rights do I have?",
          "How can these terms be modified?",
        ])
      } finally {
        setIsLoading(false)
      }
    }

    loadQuestions()
  }, [content])

  if (isLoading) {
    return (
      <div className="mt-10 mb-8 animate-pulse">
        <div className="flex items-center gap-3 mb-5">
          <Lightbulb className="h-5 w-5 text-amber-500" />
          <p className="text-base font-medium text-slate-700">Generating suggested questions...</p>
        </div>
        <div className="flex flex-wrap gap-3">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-10 w-40 bg-slate-200 rounded-md"></div>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="mt-10 mb-8">
      <div className="flex items-center gap-3 mb-5">
        <Lightbulb className="h-5 w-5 text-amber-500" />
        <p className="text-base font-medium text-slate-700">Suggested questions:</p>
      </div>
      <div className="flex flex-wrap gap-3">
        {questions.map((question, index) => (
          <Button
            key={index}
            variant="outline"
            size="sm"
            className="text-sm text-left justify-start h-auto py-2.5 px-4 bg-slate-50 hover:bg-slate-100 border-slate-200"
            onClick={() => onSelectQuestion(question)}
          >
            {question}
          </Button>
        ))}
      </div>
    </div>
  )
}

