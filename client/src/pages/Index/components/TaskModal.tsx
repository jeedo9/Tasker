import { useCallback, useEffect, useMemo, useState, type ChangeEvent, type FocusEvent, type FormEvent } from "react"
import Button from "@components/ui/Button"
import Input from "@components/ui/form/Input"
import Modal, { type ModalProps } from "@components/ui/Modal"
import Textarea from "@components/ui/form/Textarea"
import { Status, type TaskContent, type TaskInfo, type TaskInfoOptional } from "@shared/types/types"
import {createTaskSchema, titleTaskSchema} from '@shared/validators/schemas'
import { toast } from "sonner"
import Checkbox from "@components/ui/form/Checkbox"
import Label from "@components/ui/form/Label"

export type TaskModalProps<T extends 'update' | 'create' = 'update'> = Omit<ModalProps, 'title'> & {
  onClose?: () => void,
  form : {
    onTaskSubmit: (signal: {signal: AbortSignal}) => Promise<boolean>
    onChange: T extends 'update' ? (field: TaskInfoOptional |  keyof TaskInfo, remove?: boolean) => void : (field: Partial<TaskContent>) => void,
    taskExists?: (taskTitle: string) => boolean,
    resetFields: () => void,
    task?:  TaskInfo
  },
  type?: 'update' | 'create'
}

const TaskModalContent = {
  create: {
    title: 'new task',
    description: 'Create a new task for your to-do-list',
    btn: 'create'
  },
  update: {
    title: 'update task',
    description: 'Update your task',
    btn: 'update'
  }
}

const TaskModal = <T extends 'update' | 'create' = 'update'>({description,type = 'update', onClose,form : {onTaskSubmit, taskExists, onChange, resetFields, task}, ...props}: TaskModalProps<T>) => {
    const [titleError, setTitleError] = useState('')
    const [form, setForm] = useState<TaskContent>({
      title: '',
      description: ''
    })
    const [formUpdate, setFormUpdate] = useState<TaskInfo>(task ?? {
      title: '',
      description: '',
      status: Status.Pending
    })
    const [isLoading, setIsLoading] = useState(false)

    const abortController = useMemo(() =>  new AbortController(), [])
    const signal = abortController.signal


    const onSubmit = async (ev: FormEvent<HTMLFormElement>) => {
      ev.preventDefault()
        setIsLoading(true)
        const success = await onTaskSubmit({signal})
        if (success) {
          resetFields()
          if (type === 'update') toast.success('Task updated successfully !')
          onClose?.()
        }
        setIsLoading(false)
    }

    const handleOnClose = () => {
        onClose?.()
        resetFields()
        abortController.abort()
    }

    useEffect(() => {
      return () => {
        if (signal.aborted) abortController.abort()
      }
    }, [])
    
    const isSubmitDisabled = useMemo(() => {
      if (type === 'create') return !createTaskSchema.safeParse(form).success
      else {
        for (const field in formUpdate) {
        const fieldTyped = field as keyof TaskInfo
        if (formUpdate[fieldTyped] !== task?.[fieldTyped]) return false
        }
        return true
      }
    }, [formUpdate, type, task, titleError, form])

    const updateInput = (key: keyof TaskInfo, value: TaskInfo[keyof TaskInfo]) => value === task?.[key] ? onChange(key, true) : onChange({[key]: value})

    const onStatusChange = useCallback((checked: boolean) => {
          const status = checked ? Status.Done : Status.Pending
          updateInput('status', status)
          setFormUpdate({...formUpdate, status})
        }, [])

      const onTitleChange = ({target: {value: title}}: ChangeEvent<HTMLInputElement>) => {
        updateInput('title',title)
        setForm({...form, title})
        setFormUpdate({...formUpdate, title})
        const titleParsed = titleTaskSchema.safeParse(title)
        if (titleParsed.success) setTitleError('')
      }

      const onTitleBlur = ({target: {value: title}}: FocusEvent<HTMLInputElement>) => {
              const titleParsed = titleTaskSchema.safeParse(title)
              if (!titleParsed.success && titleParsed.error.errors[0]) setTitleError(titleParsed.error.errors[0].message)
              else if (taskExists?.(title)) setTitleError('This task is already in your list.')
        }

      const onDescriptionChange = ({target: {value: description}}: ChangeEvent<HTMLTextAreaElement>) => {
        updateInput('description', description)
        setForm({...form, description})
        setFormUpdate({...formUpdate, description})
      }

    return <Modal title={TaskModalContent[type].title} {...(!description ? {'aria-description': TaskModalContent[type].description} : {description})} {...props}>
        <form onSubmit={onSubmit} className="space-y-5.5 capitalize" autoComplete="off" >
        <fieldset className="flex flex-col gap-y-2">
            <Label  htmlFor="task-title" required={type === 'create'}>title</Label>
            <Input defaultValue={task?.title} id="task-title" onBlur={onTitleBlur} onChange={onTitleChange} placeholder="Task title" error={{message: titleError, className: 'normal-case'}} required />
        </fieldset>
        <fieldset className="flex flex-col gap-y-2">
          <Label htmlFor="description">description</Label>
          <Textarea defaultValue={task?.description} onChange={onDescriptionChange} id="description" placeholder="Task description" />
        </fieldset>
        {type === 'update' && 
        <Checkbox checked={task?.status === Status.Done} onChange={onStatusChange} className="has-checked:text-success/90" label="done" />
        }
        <div className="flex sm:flex-row flex-col gap-y-2 justify-between px-2">
          <Button onClick={handleOnClose} type="button" base="secondary" >Cancel</Button>
          <Button disabled={isSubmitDisabled} isLoading={isLoading}>{TaskModalContent[type].btn}</Button>
        </div>
      </form>
    </Modal>
}
export default TaskModal;