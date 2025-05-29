import { BiMoon as Moon, BiSun as Sun} from "react-icons/bi";
import Button from "./Button";
import useTheme from "../../contexts/theme/useTheme";

const ThemeToggle = () => {
    const {isDarkMode, toggleTheme} = useTheme()
    return <Button onClick={toggleTheme} base="secondary" size="sm">{isDarkMode ?  <Sun size='1.4em' /> : <Moon size='1.4em' /> }</Button>
}
export default ThemeToggle;