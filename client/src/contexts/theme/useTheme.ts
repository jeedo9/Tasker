import { createContext, use } from "react"

type ThemeContextType = {
    isDarkMode: boolean,
    toggleTheme: () => void,
    setDarkMode: () => void,
    setLightMode: () => void
} | null

export const ThemeContext = createContext<ThemeContextType>(null)

const useTheme = () => {
    const themeContext = use(ThemeContext)
    if (!themeContext) throw new Error('Accessing the values of the theme context requires being a consumer..')
    return themeContext
}
export default useTheme;