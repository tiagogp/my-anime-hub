import "@/styles/globals.css"
import { Metadata } from "next"

import { siteConfig } from "@/config/site"
import { fontDisplay, fontMono, fontSans } from "@/lib/fonts"
import { cn } from "@/lib/utils"
import { Footer } from "@/components/ui/footer"
import Providers from "@/components/providers"
import { SiteHeader } from "@/components/site-header"
import { ThemeProvider } from "@/components/theme-provider"

export const metadata: Metadata = {
  title: {
    default: siteConfig.name,
    template: `%s - ${siteConfig.name}`,
  },
  description: siteConfig.description,
  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon-16x16.png",
    apple: "/apple-touch-icon.png",
  },
}

interface RootLayoutProps {
  children: React.ReactNode
}

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <>
      <html lang="en" suppressHydrationWarning>
        <head />
        <body
          className={cn(
            "min-h-screen bg-background font-sans text-foreground antialiased",
            fontSans.variable,
            fontMono.variable,
            fontDisplay.variable
          )}
        >
          <Providers>
            <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
              <div className="relative flex min-h-screen flex-col pb-[calc(4.5rem+env(safe-area-inset-bottom))] sm:pb-0">
                <a
                  href="#main-content"
                  className="sr-only z-50 bg-background p-4 focus:not-sr-only focus:fixed focus:left-4 focus:top-4"
                >
                  Skip to content
                </a>
                <SiteHeader />
                <main
                  id="main-content"
                  tabIndex={-1}
                  className="min-w-0 flex-1"
                >
                  {children}
                </main>
                <Footer />
              </div>
            </ThemeProvider>
          </Providers>
        </body>
      </html>
    </>
  )
}
