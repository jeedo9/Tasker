import type { ComponentProps } from "react";
import cn from "../../utils/helpers";

type TextareaProps = ComponentProps<'textarea'>
const Textarea = ({className, children, ...props}: TextareaProps) => {
    return <textarea className={cn("bg-tertiary h-15.5 resize-none px-3 py-1 rounded-sm caret-zinc-400 placeholder:text-zinc-400", className)} {...props}>
        {children}
    </textarea>
}
export default Textarea;