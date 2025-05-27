import type { ComponentProps } from "react";
import clsx from "clsx";
import type { RemoveChildren } from "../../types";

type LogoProps = RemoveChildren<ComponentProps<'h1'>> & {
    as?: 'h1' | 'h2'
}

const Logo = ({as = 'h1', className, ...props}: LogoProps) => {
    const Comp = as
    return <Comp className={clsx('logo', className)} {...props}>Tasker</Comp>
}
export default Logo;