"use client"

import * as React from "react"
import { ThemeProviderContext } from "@/contexts/theme-context"

type Theme = "dark" | "light" | "system"

type ThemeProviderProps = {
  children: React.ReactNode
  defaultTheme?: Theme
  storageKey?: string
}

/**
 * Zipli currently enforces dark mode globally (no system mode, no user toggle).
 */
export function ThemeProvider({ children }: ThemeProviderProps) {
  React.useEffect(() => {
    if (typeof window === "undefined") return

    const root = window.document.documentElement
    root.classList.remove("light", "dark")
    root.classList.add("dark")
  }, [])

  const value = React.useMemo(
    () => ({
      theme: "dark" as Theme,
      // Intentionally a no-op while dark mode is enforced.
      setTheme: (_theme: Theme) => {},
    }),
    []
  )

  return (
    <ThemeProviderContext.Provider value={value}>{children}</ThemeProviderContext.Provider>
  )
}
