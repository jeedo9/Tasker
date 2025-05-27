import type { ComponentProps } from "react";
import cn from "../../utils/helpers";
import Overlay, { type OverlayProps } from "./Overlay";

export type ModalProps = ComponentProps<'div'> & {
    title: string,
    description?: string,
    overlay?: OverlayProps
}
const Modal = ({className, children, description, title, overlay, ...props}: ModalProps) => {
    return <Overlay {...overlay} >
        <div id="modal" role="dialog" aria-labelledby="title" aria-describedby="description" aria-modal="true" className={cn("bg-background border-[.07rem] scale-100! opacity-100! rotate-y-0! translate-z-0! -translate-z-12 -rotate-y-8 scale-95 duration-250 opacity-60 transition border-border inset-shadow-xs space-y-3 inset-shadow-primary rounded-lg mx-5 px-5 sm:px-7 py-5 w-[45ch] sm:w-[53ch] max-h-[72vh]", className)} {...props}>
            <h2 id="title" className="sm:text-left text-center">{title}</h2>
            {description && <p id="description" className="text-zinc-500">{description}</p>}
                {children}
            </div>
    </Overlay> 
}
export default Modal;