import type { ComponentProps } from "react";
import cn from "../../utils/helpers";
import type { RemoveChildren } from "../../types";

type InputProps = RemoveChildren<ComponentProps<'input'>>
const Input = ({className, ...props}: InputProps) => {
    return <input className={cn("bg-tertiary indent-3 py-1 rounded-md caret-zinc-400 placeholder:text-zinc-400", className)} {...props} />
}
export default Input;