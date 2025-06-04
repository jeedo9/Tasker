import type { ComponentProps } from "react";
import cn from "../../utils/helpers";
import ErrorMsg, { type ErrorMsgProps } from "./ErrorMsg";

type TextareaProps = ComponentProps<'textarea'> & {
    error?: ErrorMsgProps
}
const Textarea = ({className, children,error, ...props}: TextareaProps) => {
    return <> <textarea className={cn("bg-tertiary h-15.5 resize-none px-3 py-1 rounded-sm caret-zinc-400 placeholder:text-zinc-400", className)} {...props}>
        {children}
    </textarea>
    <ErrorMsg {...error} />
    </>
}
export default Textarea;