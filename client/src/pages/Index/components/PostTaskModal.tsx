import { useState, type FormEvent } from "react"
import Button from "@components/ui/Button"
import Input from "@components/ui/Input"
import Modal, { type ModalProps } from "@components/ui/Modal"
import Textarea from "@components/ui/Textarea"
import type { TaskContent } from "@shared/types/types"
import {titleTaskSchema} from '@shared/validators/schemas'
import { toast } from "sonner"


type PostTaskModalProps = Omit<ModalProps, 'title'> & {
  onClose: () => void,
  form : {
    onTaskSubmit: () => Promise<void>
    onChange: (field: Partial<Record<keyof TaskContent, string>>) => void,
    taskExists: (taskTitle: string) => boolean,
    resetFields: () => void
  }
}

const PostTaskModal = ({description, onClose,form : {onTaskSubmit, taskExists, onChange, resetFields}, ...props}: PostTaskModalProps) => {
    const [titleError, setTitleError] = useState('')
    const onSubmit = (ev: FormEvent<HTMLFormElement>) => {
      ev.preventDefault()
      if (titleError){
         toast.error('Fix the title of your task before create it')
         return
      }
      onTaskSubmit()
      resetFields()
    }
    const handleOnClose = () => {
        onClose()
        resetFields()
    }

    return <Modal title="new task" {...(!description ? {'aria-description': "Create a new task for your to-do-list"} : {description})} {...props}>
        <form onSubmit={onSubmit} className="space-y-5.5 capitalize" autoComplete="off" >
        <fieldset className="flex flex-col gap-y-2">
            <label htmlFor="title">Title<span className="ml-1 text-destructive" >*</span></label>
            <Input onBlur={({target: {value: title}}) => {
              const titleParsed = titleTaskSchema.safeParse(title)
              if (!titleParsed.success && titleParsed.error.errors[0]) setTitleError(titleParsed.error.errors[0].message)
              else if (taskExists(title)) setTitleError('This task is already in your list.')
              else setTitleError('')
            }} onChange={({target: {value: title}}) => {onChange({title})}} placeholder="Task title" error={{message: titleError, className: 'normal-case'}} id="title" required />
        </fieldset>
        <fieldset className="flex flex-col gap-y-2">
          <label htmlFor="description">Description</label>
          <Textarea onChange={({target: {value: description}}) => onChange({description})} id="description" placeholder="Task description" />
        </fieldset>
        <div className="flex sm:flex-row flex-col gap-y-2 justify-between px-2">
          <Button onClick={handleOnClose} type="button" base="secondary" >Cancel</Button>
          <Button>Create</Button>
        </div>
      </form>
    </Modal>
}
export default PostTaskModal;