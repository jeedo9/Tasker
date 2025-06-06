import type { ComponentProps } from "react"
import cn from "@utils/helpers"
import type { RemoveChildren } from "@typings/."

export type ErrorMsgProps = {
    message?: string
} & RemoveChildren<ComponentProps<'small'>>
const ErrorMsg = ({message, className, ...props}: ErrorMsgProps) => {
    return message && <small className={cn("animate-pulse text-destructive text-center", className)} {...props}>{message}</small>
}
export default ErrorMsg;