import { BiMoon as Moon, BiSun as Sun} from "react-icons/bi";
import Button from "./Button";
import useTheme from "@contexts/theme/useTheme";

const ThemeToggle = () => {
    const {isDarkMode, toggleTheme} = useTheme()
    return <Button onClick={toggleTheme} base="secondary" size="sm">{isDarkMode ?  <Sun size='1.4em' aria-label="sun" /> : <Moon size='1.4em' aria-label="moon" /> }</Button>
}
export default ThemeToggle;