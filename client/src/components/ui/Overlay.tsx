import type { ComponentProps, PropsWithChildren } from "react";
import cn from "../../utils/helpers";

export type OverlayProps = ComponentProps<'div'> 
type OverlayProp = OverlayProps & Required<PropsWithChildren>
const Overlay = ({children, className, ...props}: OverlayProp) => {
    return <div className={cn("bg-black/55  perspective-midrange scale-98 opacity-0 transition duration-250 scale-100 opacity-100 rounded-lg perspective-origin-bottom-right fixed inset-0 flex justify-center items-center", className)} {...props}>
        {children}
    </div>
}
export default Overlay;