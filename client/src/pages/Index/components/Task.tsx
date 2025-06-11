import { BiPencil as Pencil, BiCheck as Check, BiTrash as Trash} from "react-icons/bi";
import Button from "@components/ui/Button";
import cn from "@utils/helpers";
import type { ITask} from "@shared/types/types";
import { Status } from "@shared/types/types";
import clsx from "clsx";
import { useMemo, useState } from "react";
import useModal from "@contexts/modal/useModal";
import TaskModal, { type TaskModalProps } from "./TaskModal";

type TaskProps = {
    className?: string,
    onDelete: (taskId: ITask['id']) => Promise<boolean | void>,
    onUpdate: (taskId: ITask['id']) => Promise<void>,
    taskModal: Omit<TaskModalProps<'update'>, 'type' | 'form'> & {
      form: (Omit<TaskModalProps<'update'>['form'], 'onTaskSubmit'>) & {onTaskSubmit: (taskId: ITask['id'], signal: {signal: AbortSignal}) => Promise<void>}
    }
} & ITask

const Task = ({className,onUpdate, onDelete, id, title, description, status, taskModal: {form: {onTaskSubmit, ...taskModalFormProps}, onClose, ...taskModalProps}}: TaskProps) => {
    const [isDeleting, setIsDeleting] = useState(false)
    const {setModal, isModalOpen} = useModal()
    const [openModal, setOpenModal] = useState(false)

    const handleDelete = async () => {
        const isDeleting = await onDelete(id) 
        if (isDeleting) setIsDeleting(true)
    }

    const handleOnClickUpdate = () => {
      setModal('taskUpdate', true)
      setOpenModal(true)
    }
    const handleOnCloseModal = () => {
      onClose?.()
      setOpenModal(false)
    }

    const handleTaskSubmit = async (signal: {signal: AbortSignal}) => {
      try {
        await onTaskSubmit(id, signal)
        setOpenModal(false)
      } catch (error) {}
    }

      const task = useMemo(() => ({status, title, description}), [status, title, description])
    return <div className={cn("flex relative min-h-28.5 shadow-sm hover:shadow-md transition group hover:bg-tertiary/85 duration-300 bg-tertiary rounded-md py-4 px-6 border-[.06em] border-border w-full sm:w-[inherit]", status === Status.Done && 'opacity-55', isDeleting && 'animate-delete',className)}>
        <div className="space-y-3 w-full"> 
          <h2 className={clsx("font-bold wrap-anywhere w-fit hover:scale-102 transition-all duration-300 text-shadow-sm/15 dark:text-shadow-sm/33 max-w-[79%] sm:max-w-[90%] text-shadow-foreground normal-case", status === Status.Done && 'line-through')}>{title}</h2>
          <p className="wrap-anywhere">{description}</p>
        </div>
        <div className="flex gap-x-2 text-xl absolute right-4 sm:right-5 [&>button]:rounded-xs [&>button]:hover:opacity-70 [&>button]:active:scale-92 [&>button]:transition">
          <Button onClick={() => onUpdate(id)} noStyle><Check aria-label="check" className={clsx(status === Status.Done && 'text-success')} /></Button>
          <Button onClick={handleDelete} noStyle><Trash aria-label="trash" className="text-destructive" /></Button>
        </div>
      {status === Status.Pending && <div className="bg-gradient-to-t -z-10 group-hover:z-0 from-tertiary translate-x-1/2 from-62% to-border group-hover:border-b-transparent group-hover:from-55% group-hover:from-tertiary/85 transition-all duration-250 absolute bottom-[81.3%] transform-gpu group-hover:-translate-y-[1.2rem] group-hover:delay-200 rounded-b-xs right-8 w-10 rounded-sm flex justify-center [border-width:inherit] items-center h-6.5">
          <Button onClick={handleOnClickUpdate} noStyle><Pencil/></Button>

        </div>}
        {isModalOpen('taskUpdate') && openModal && <TaskModal type="update" form={{onTaskSubmit: handleTaskSubmit, task, ...taskModalFormProps}} {...taskModalProps}  onClose={handleOnCloseModal} />}
    </div>
}
export default Task;