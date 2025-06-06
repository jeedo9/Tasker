import type { ComponentProps } from "react"
import cn from "@utils/helpers"
import type { RemoveChildren } from "@typings/."

type SpinnerProps = RemoveChildren<ComponentProps<'span'>>
const Spinner = ({className, ...props}: SpinnerProps) => {
    return <span className={cn("border-l-2 border-l-transparent border-r-2 border-r-transparent border-t-2 border-t-primary animate-spin size-6 rounded-full", className)} aria-hidden {...props} />
}
export default Spinner