import type { ComponentProps } from "react";
import cn from "../../utils/helpers";
import type { RemoveChildren } from "../../types";
import ErrorMsg, { type ErrorMsgProps } from "./ErrorMsg";

type InputProps = RemoveChildren<ComponentProps<'input'>> & {
    error?: ErrorMsgProps
}
const Input = ({className, error, ...props}: InputProps) => {
    return <>
    <input className={cn("bg-tertiary indent-3 py-1 rounded-md caret-zinc-400 placeholder:text-zinc-400", className)} {...props} />
    <ErrorMsg {...error} />
    </> 
}
export default Input;