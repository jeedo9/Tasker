import type { ComponentProps } from "react"
import cn from "@utils/helpers"
import type { RemoveChildren } from "@typings/."
import type { RemoveS } from "@shared/types/types"

const spinnerVariants = {
    bases: {
        primary: 'border-t-primary',
        light: 'border-t-slate-200'
    },
    sizes: {
        sm: 'size-[1.1rem]',
        md: 'size-6.5',
        lg: 'size-8.5'
    }
}

type SpinnerVariants = {
    [key in keyof typeof spinnerVariants as RemoveS<key>]?: keyof typeof spinnerVariants[key]
}
export type SpinnerVariantsBaseSize = Pick<SpinnerVariants, 'base' | 'size'>
export type SpinnerProps = RemoveChildren<ComponentProps<'span'>> & SpinnerVariants

const Spinner = ({className, size= 'md', base = 'primary', ...props}: SpinnerProps) => {
    return <span className={cn("border-l-2 border-l-transparent border-r-2 border-r-transparent border-t-2 animate-spin rounded-full", spinnerVariants.bases[base], spinnerVariants.sizes[size] , className)} aria-hidden {...props} />
}
export default Spinner