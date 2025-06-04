import type { ComponentProps, PropsWithChildren } from "react";
import cn from "../../utils/helpers";

export type OverlayProps = ComponentProps<'div'> & {
    isOpen?: boolean
} & Required<PropsWithChildren> 
const Overlay = ({children, className, isOpen = true, ...props}: OverlayProps) => {
    return isOpen && <div className={cn("bg-black/55 perspective-midrange transition duration-250 starting:scale-93 starting:opacity-0 rounded perspective-origin-bottom-right fixed inset-0 flex justify-center items-center", className)} {...props}>
        {children}
    </div>
}
export default Overlay;