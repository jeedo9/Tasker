import type { ComponentProps } from "react"

type LabelProps = ComponentProps<'label'> & {
    required?: boolean
}
const Label = ({children, required, ...props}: LabelProps) => {
    return <label {...props}>
        {children}
        {required && <span className="text-destructive ml-1">*</span>}
    </label>
}
export default Label;