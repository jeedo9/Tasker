import type { ComponentProps } from "react";
import type {RemoveS} from '@shared/types/types'
import cn from "@utils/helpers";
import Spinner, { type SpinnerProps, type SpinnerVariantsBaseSize } from "./Spinner";

const buttonVariants = {
    bases: {
    primary: 'text-slate-200 shadow-sm hover:shadow-md hover:bg-primary-dark transition-all ease-out focus-visible:bg-primary-dark focus-visible:rounded-lg hover:-translate-y-[1.2px] duration-350 hover:rounded-lg shadow-primary bg-primary',
    secondary: 'text-primary hover:bg-secondary transition-[background-color] focus-visible:bg-secondary duration-200 ease-in',
    destructive: 'text-destructive hover:text-slate-200 hover:bg-destructive/58 font-bold transition-colors duration-350'
    },
    sizes: {
        sm: 'rounded-lg py-[.46rem] px-2',
        md: 'py-[.32rem] px-6 ',
        lg: 'py-2 px-10'
    }
}

type ButtonVariants = {
    [key in keyof typeof buttonVariants as RemoveS<key>]?: keyof typeof buttonVariants[key]
}

type ButtonProps = ComponentProps<'button'> & ButtonVariants & {
    noStyle?: boolean,
    isLoading?: boolean,
    spinner?: SpinnerProps
}
const spinnerDefaults: SpinnerVariantsBaseSize = {
    base: 'light',
    size: 'sm'
}
const Button = ({className, isLoading, children, spinner, noStyle, base = 'primary', size = 'md', ...props}: ButtonProps) => {
    const classes = !noStyle ? cn("font-semibold inline-flex justify-center items-center md:text-base text-md capitalize rounded-md", buttonVariants.bases[base], buttonVariants.sizes[size], isLoading && 'min-h-[32.08px]', className) : className
    return <button className={classes} {...props}>
       {isLoading ? <Spinner {...{...spinnerDefaults, ...spinner}} /> : children}
    </button>
}
export default Button;