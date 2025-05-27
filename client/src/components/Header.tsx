import type { ComponentProps } from "react"
import Logo from "./ui/Logo"
import ThemeToggle from "./ui/ThemeToggle"
import cn from "../utils/helpers"
import type { RemoveChildren } from "../types"

export type HeaderProps = RemoveChildren<ComponentProps<'header'>>
const Header = ({className,...props}: HeaderProps) => {
    return <header className={cn("w-full flex justify-between items-center px-2.5 sm:px-5", className)} {...props}>
      <Logo />
      <ThemeToggle />
    </header>
}
export default Header;