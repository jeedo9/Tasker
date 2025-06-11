import type { ComponentProps, PropsWithChildren } from "react";
import cn from "@utils/helpers";
import { createPortal } from "react-dom";

export type OverlayProps = ComponentProps<'div'> & Required<PropsWithChildren> 
const Overlay = ({children, className, ...props}: OverlayProps) => {
    return createPortal(<div className={cn("bg-black/55 perspective-midrange transition duration-250 starting:scale-93 starting:opacity-0 rounded perspective-origin-bottom-right fixed inset-0 flex justify-center items-center", className)} {...props}>
        {children}
    </div>, document.body)
}
export default Overlay;