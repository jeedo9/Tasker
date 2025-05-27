import type { ComponentProps } from "react";
import Header, { type HeaderProps } from "./Header";
import cn from "../utils/helpers";

type LayoutProps = ComponentProps<'div'> & {header?: HeaderProps}
const Layout = ({header, className, children, ...props}: LayoutProps) => {
    return <div className={cn("flex flex-col justify-center items-center gap-y-9 sm:w-4/5 w-full mx-auto mt-11.5", className)} {...props}>
    <Header {...header} />
    {children}
  </div>
}
export default Layout;