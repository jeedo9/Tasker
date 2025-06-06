import { BiCheck as Check, BiTrash as Trash} from "react-icons/bi";
import Button from "@components/ui/Button";
import cn from "@utils/helpers";
import type { ITask} from "@shared/types/types";
import { Status } from "@shared/types/types";
import clsx from "clsx";
import { useState } from "react";

type TaskProps = {
    className?: string,
    onDelete: (taskId: ITask['id']) => Promise<boolean | void>,
    onUpdate: (taskId: ITask['id']) => Promise<void>
} & ITask

const Task = ({className,onUpdate, onDelete, id, title, description, status}: TaskProps) => {
    const [isDeleting, setIsDeleting] = useState(false)
    const handleDelete = async () => {
        const isDeleting = await onDelete(id) 
        if (isDeleting) setIsDeleting(true)
    }
    return <div className={cn("flex min-h-28.5 relative shadow-sm hover:shadow-md transition hover:bg-tertiary/85 duration-300 bg-tertiary rounded-md py-4 px-6 border-[.06em] border-border w-full sm:w-[inherit]", status === Status.Done && 'opacity-55', isDeleting && 'animate-delete',className)}>
        <div className="space-y-3 w-full"> 
          <h2 className={clsx("font-bold wrap-anywhere w-fit hover:scale-102 transition-all duration-300 text-shadow-sm/15 dark:text-shadow-sm/33 max-w-[79%] sm:max-w-[90%] text-shadow-foreground normal-case", status === Status.Done && 'line-through')}>{title}</h2>
          <p className="wrap-anywhere">{description}</p>
        </div>
        <div className="flex gap-x-2 text-xl absolute right-4 sm:right-5 [&>button]:rounded-xs [&>button]:hover:opacity-70 [&>button]:active:scale-92 [&>button]:transition">
          <Button onClick={() => onUpdate(id)} noStyle><Check aria-label="check" className={clsx(status === Status.Done && 'text-success')} /></Button>
          <Button onClick={handleDelete} noStyle><Trash aria-label="trash" className="text-destructive" /></Button>
        </div>
    </div>
}
export default Task;