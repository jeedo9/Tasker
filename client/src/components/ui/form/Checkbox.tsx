import { useEffect, useState, type MouseEvent } from "react";
import Input from "./Input";
import cn from "@utils/helpers";
import Label from "./Label";

type CheckboxProps = {
    className?: string,
    label: string,
    onChange: (value: boolean) => void,
    checked?: boolean
}
const Checkbox = ({className, label, onChange, checked: defaultChecked = false}: CheckboxProps) => {
    const [checked, setChecked] = useState(defaultChecked)
    const onClick = (e: MouseEvent<HTMLLabelElement>) => {
        e.preventDefault()
        setChecked(!checked)
    }
    useEffect(() => {
        onChange(checked)
    }, [checked, onChange])
    return <Label className={cn("inline-flex leading-1 p-[.425rem] rounded-sm justify-center items-center relative before:bg-tertiary before:size-[1.21rem] before:rounded-sm before:border-[.08em] after:rounded-[.075em] has-checked:after:opacity-100 has-checked:after:scale-100 after:transition after:duration-200 after:opacity-0 after:scale-40 after:-rotate-28 has-checked:after:-rotate-45 after:left-2 after:top-1/2 after:-translate-y-1/2 after:w-4 after:h-1 after:border-l-zinc-400 after:border-l-[.17em]  after:border-b-[.1em] after:border-b-zinc-400 after:absolute before:border-border gap-x-1.5 cursor-pointer hover:bg-tertiary transition duration-200", className)} onClick={onClick} onKeyDown={({key}) => key === ' ' && setChecked(!checked)} tabIndex={0} role="checkbox" aria-label={label} aria-checked={checked}  >
        <Input checked={checked} readOnly hidden type="checkbox" />
        {label}
</Label>
}
export default Checkbox;