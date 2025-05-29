import { useEffect, useState, type PropsWithChildren } from "react";
import { ThemeContext } from "./useTheme";



type ThemeContextProps = PropsWithChildren
const themeKey = 'theme';
type Theme = 'dark' | 'light'
const ThemeProvider = ({children}: ThemeContextProps) => {
    const [isDarkMode, setIsDarkMode] = useState(() => localStorage.getItem(themeKey) as Theme === 'dark')

    useEffect(() => {
        const {documentElement: html} = document
        if (isDarkMode) {
            localStorage.setItem(themeKey, 'dark')
            html.classList.add('dark')
        }
        else {
            localStorage.setItem(themeKey, 'light')
            html.className = ''
        }
    }, [isDarkMode])
    
    const toggleTheme = () => setIsDarkMode(!isDarkMode)
    
    const setDarkMode = () => setIsDarkMode(true)
    
    const setLightMode = () => setIsDarkMode(false)

    const value = {
        isDarkMode,
        toggleTheme,
        setDarkMode,
        setLightMode
    }
    return <ThemeContext.Provider value={value}>
        {children}
    </ThemeContext.Provider>
}
export default ThemeProvider;
