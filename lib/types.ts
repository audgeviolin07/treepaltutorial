export type AnalysisResult = {
  success: boolean
  error?: string
  data?: {
    url: string
    content: string
    summary: string
  }
}

export type TermsResponse = {
  message: string
}

export type SuggestedQuestionsResponse = string[]

