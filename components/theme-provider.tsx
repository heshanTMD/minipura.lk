'use client'

import * as React from 'react'
import {
  ThemeProvider as NextThemesProvider,
  type ThemeProviderProps,
  useTheme,
} from 'next-themes'

export function ThemeProvider({ children, ...props }: ThemeProviderProps) {
  return <NextThemesProvider {...props}>{children}</NextThemesProvider>
}

// ThemeToggle component for UI
export function ThemeToggle() {
  const { theme, setTheme } = useTheme()

  return (
    <div className="flex items-center gap-2">
      <span className="text-sm">Theme:</span>
      <button
        className={`px-3 py-1 rounded ${theme === 'light' ? 'bg-primary text-white' : 'bg-muted'}`}
        onClick={() => setTheme('light')}
        aria-pressed={theme === 'light'}
      >
        Light
      </button>
      <button
        className={`px-3 py-1 rounded ${theme === 'dark' ? 'bg-primary text-white' : 'bg-muted'}`}
        onClick={() => setTheme('dark')}
        aria-pressed={theme === 'dark'}
      >
        Dark
      </button>
      <button
        className={`px-3 py-1 rounded ${theme === 'system' ? 'bg-primary text-white' : 'bg-muted'}`}
        onClick={() => setTheme('system')}
        aria-pressed={theme === 'system'}
      >
        System
      </button>
    </div>
  )
}

// AppLayout component
export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      <header className="p-4 border-b flex justify-end">
        <ThemeToggle />
      </header>
      {children}
    </ThemeProvider>
  )
}
