import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Terms of Service Chatbot',
  description: 'A chatbot that helps you understand the terms of service of the websites you visit.',
  generator: 'Chatbot',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
