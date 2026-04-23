import { createContext, useContext, useEffect, useState } from 'react'

// 1. Define the shape of what this context provides
type Theme = 'light' | 'dark'

interface ThemeContextType {
  theme: Theme
  toggleTheme: () => void
}

// 2. Create the context with a default value
const ThemeContext = createContext<ThemeContextType>({
  theme: 'light',
  toggleTheme: () => {}
})

// 3. The Provider — wraps the app and makes theme available everywhere
export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState<Theme>(() => {
    // On first load, check if user had a saved preference
    const saved = localStorage.getItem('invoice-theme')
    return (saved === 'dark' || saved === 'light') ? saved : 'light'
  })

  useEffect(() => {
    // Whenever theme changes, update the body class and save to localStorage
    document.body.className = theme
    localStorage.setItem('invoice-theme', theme)
  }, [theme])

  const toggleTheme = () => {
    setTheme(prev => prev === 'light' ? 'dark' : 'light')
  }

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  )
}

// 4. Custom hook — any component calls this to get theme + toggleTheme
export function useTheme() {
  return useContext(ThemeContext)
}