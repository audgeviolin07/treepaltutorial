import { WebsiteAnalyzer } from "@/components/website-analyzer"
import { Toaster } from "@/components/ui/toaster"

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100 p-6 md:p-10">
      <div className="mx-auto max-w-6xl">
        <header className="mb-12 text-center">
          <h1 className="text-3xl font-bold tracking-tight text-slate-900 md:text-4xl lg:text-5xl">
            Terms of Service Analyzer
          </h1>
          <p className="mt-4 text-lg text-slate-600">
            Understand what websites and social media platforms require in their terms
          </p>
        </header>

        <div className="rounded-xl border bg-white shadow-sm overflow-hidden">
          <div className="grid lg:grid-cols-[1fr_2fr]">
            {/* The animation will be rendered by WebsiteAnalyzer */}
            <WebsiteAnalyzer />
          </div>
        </div>
      </div>
      <Toaster />
    </main>
  )
}

