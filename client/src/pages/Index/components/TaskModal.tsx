import { useCallback, useEffect, useMemo, useState, type ChangeEvent, type FocusEvent, type FormEvent } from "react"
import Button from "@components/ui/Button"
import Input from "@components/ui/form/Input"
import Modal, { type ModalProps } from "@components/ui/Modal"
import Textarea from "@components/ui/form/Textarea"
import { Status, type ITask, type TaskContent } from "@shared/types/types"
import {titleTaskSchema} from '@shared/validators/schemas'
import { toast } from "sonner"
import Checkbox from "@components/ui/form/Checkbox"

export type TaskModalProps<T extends 'update' | 'create'> = Omit<ModalProps, 'title'> & {
  onClose?: () => void,
  form : {
    onTaskSubmit: (signal: {signal: AbortSignal}) => Promise<void>
    onChange: T extends 'update' ? (field: Partial<TaskContent & Pick<ITask, 'status'>> |  keyof (TaskContent & Pick<ITask, 'status'>), remove?: boolean) => void : (field: Partial<TaskContent>) => void,
    taskExists?: (taskTitle: string) => boolean,
    resetFields: () => void,
    task?:  TaskContent & Pick<ITask, 'status'>
  },
  type?: 'update' | 'create' // s
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

const TaskModal = <T extends 'update' | 'create'>({description,type = 'create', onClose,form : {onTaskSubmit, taskExists, onChange, resetFields, task}, ...props}: TaskModalProps<T>) => {
    const [titleError, setTitleError] = useState('')
    const [form, setForm] = useState<TaskContent & Pick<ITask, 'status'>>({
      title: '',
      description: '',
      status: Status.Pending
    })
    const [isLoading, setIsLoading] = useState(false)

    const abortController = useMemo(() =>  new AbortController(), [])
    const signal = abortController.signal


    const onSubmit = async (ev: FormEvent<HTMLFormElement>) => {
      ev.preventDefault()
      if (titleError){
         toast.error(`Fix the title of your task before ${type} it`)
         return
      }
      try {
          setIsLoading(true)
          await onTaskSubmit({signal})
          resetFields()
      }
      finally {
        setIsLoading(false)
      }
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

    useEffect(() => {
      if (type === 'update' && task) setForm(task)
    }, [type, onChange, task])
    
    const hasNoChanges = useMemo(() => {
      if (type === 'create') return
      for (const field in form) {
        const fieldTyped = field as keyof (TaskContent & Pick<ITask, 'status'>)
        if (form[fieldTyped] !== task?.[fieldTyped]) return false
      }
      return true
    }, [form, type, task])

    const updateInput = (key: keyof (TaskContent & Pick<ITask, 'status'>), value: (TaskContent & Pick<ITask, 'status'>)[keyof (TaskContent & Pick<ITask, 'status'>)]) => value === task?.[key] ? onChange(key, true) : onChange({[key]: value})

    const onStatusChange = useCallback((checked: boolean) => {
          const status = checked ? Status.Done : Status.Pending
          updateInput('status', status)
          setForm(prev => ({...prev, status}))
        }, [])

      const onTitleChange = ({target: {value: title}}: ChangeEvent<HTMLInputElement>) => {
        updateInput('title',title)
        setForm({...form, title})
        const titleParsed = titleTaskSchema.safeParse(title)
        if (titleParsed.success) setTitleError('')
      }

      const onTitleBlur = ({target: {value: title}}: FocusEvent<HTMLInputElement>) => {
              const titleParsed = titleTaskSchema.safeParse(title)
              if (!titleParsed.success && titleParsed.error.errors[0]) setTitleError(titleParsed.error.errors[0].message)
              else if (taskExists?.(title)) setTitleError('This task is already in your list.')
              else setTitleError('')
        }

      const onDescriptionChange = ({target: {value: description}}: ChangeEvent<HTMLTextAreaElement>) => {
      updateInput('description', description)

        setForm({...form, description})
      }

    return <Modal title={TaskModalContent[type].title} {...(!description ? {'aria-description': TaskModalContent[type].description} : {description})} {...props}>
        <form onSubmit={onSubmit} className="space-y-5.5 capitalize" autoComplete="off" >
        <fieldset className="flex flex-col gap-y-2">
            <label htmlFor="task-title">Title {type === 'create' && <span className="ml-1 text-destructive" >*</span>}</label>
            <Input defaultValue={task?.title} id="task-title" onBlur={onTitleBlur} onChange={onTitleChange} placeholder="Task title" error={{message: titleError, className: 'normal-case'}} required />
        </fieldset>
        <fieldset className="flex flex-col gap-y-2">
          <label htmlFor="description">Description</label>
          <Textarea defaultValue={task?.description} onChange={onDescriptionChange} id="description" placeholder="Task description" />
        </fieldset>
        {type === 'update' && 
        <Checkbox checked={task?.status === Status.Done} onChange={onStatusChange} className="has-checked:text-success/90" label="done" />
        }
        <div className="flex sm:flex-row flex-col gap-y-2 justify-between px-2">
          <Button onClick={handleOnClose} type="button" base="secondary" >Cancel</Button>
          <Button disabled={hasNoChanges} isLoading={isLoading}>{TaskModalContent[type].btn}</Button>
        </div>
      </form>
    </Modal>
}
export default TaskModal;