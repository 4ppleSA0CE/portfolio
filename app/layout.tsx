import type React from "react"
import type { Metadata } from "next"
import { Geist, Geist_Mono } from "next/font/google"
import { Analytics } from "@vercel/analytics/next"
import { ThemeProvider } from "@/components/theme-provider"
import { TetrisModeProvider } from "../components/tetris/mode"
import { TetrisShell } from "../components/tetris/TetrisShell"
import "./globals.css"

const _geist = Geist({ subsets: ["latin"] })
const _geistMono = Geist_Mono({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Derek Wang Portfolio",
  description:
    "Portfolio",
  keywords: ["developer", "portfolio"],
  generator: 'v0.app',
  icons: {
    icon: '/derek.svg',
    apple: '/derek.svg',
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`h-screen overflow-hidden font-sans antialiased`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem
        >
          <TetrisModeProvider>
            <TetrisShell>{children}</TetrisShell>
          </TetrisModeProvider>
        </ThemeProvider>
        <Analytics />
      </body>
    </html>
  )
}
