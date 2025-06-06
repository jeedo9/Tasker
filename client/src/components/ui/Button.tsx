import type { ComponentProps } from "react";
import type {RemoveS} from '@shared/types/types'
import cn from "@utils/helpers";

const buttonVariants = {
    bases: {
    primary: 'text-slate-200 shadow-sm hover:shadow-md hover:bg-primary-dark transition-all ease-out focus-visible:bg-primary-dark focus-visible:rounded-lg hover:-translate-y-[1.2px] duration-350 hover:rounded-lg shadow-primary bg-primary',
    secondary: 'text-primary hover:bg-secondary transition-[background-color] focus-visible:bg-secondary duration-200 ease-in'
    },
    sizes: {
        sm: 'rounded-lg py-[.47rem] px-2',
        md: 'py-[.32rem] px-6 ',
        lg: 'py-2 px-10'
    }
}

type ButtonVariants = {
    [key in keyof typeof buttonVariants as RemoveS<key>]?: keyof typeof buttonVariants[key]
}

type ButtonProps = ComponentProps<'button'> & ButtonVariants & {
    noStyle?: boolean
}
const Button = ({className, children, noStyle, base = 'primary', size = 'md', ...props}: ButtonProps) => {

    const classes = !noStyle ? cn("font-semibold md:text-base text-md capitalize rounded-md", buttonVariants.bases[base], buttonVariants.sizes[size], className) : className
    return <button className={classes} {...props}>
        {children}
    </button>
}
export default Button;