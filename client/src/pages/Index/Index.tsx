import {useCallback, useEffect, useState } from "react";
import Button from "@components/ui/Button";
import TaskModal from "./components/TaskModal";
import Task from "./components/Task";
import api from "@utils/api";
import type { ITask, ResponseTask, ResponseTasks, TaskContent, Success } from "@shared/types/types";
import useModal from "@contexts/modal/useModal";
import { Status, Code } from "@shared/types/types";
import { toast } from "sonner";
import { AxiosError } from "axios";
import Spinner from "@components/ui/Spinner";
import { BiTrash as Trash} from "react-icons/bi";


const Index = () => {
  const [tasks, setTasks] = useState<ITask[]>([])
    const [form, setForm] = useState<TaskContent>({
      title: '',
      description: ''
    })
    const [formUpdate, setFormUpdate] = useState<Partial<TaskContent & Pick<ITask, 'status'>>>({})
  const {setModal, isModalOpen} = useModal()
  const [isLoading, setIsLoading] = useState(true)

    useEffect(() => {
      async function getTasks() {
        try {
            const {data: {data: {tasks}}} = await api.get<Success<Code.OK, ResponseTasks>>('/tasks')
            setTasks(tasks)
        } catch (error) {
          console.error(error)
          toast.error('Cannot get your tasks.. Try refresh Tasker.')
        }
        finally {
          setIsLoading(false)
        }
      }
      getTasks()
    }, [])

    const taskExists = (taskTitle: string) => {
      const exists = tasks.some(task => task.title === taskTitle)
      return exists
    }



    const onCreateTaskSubmit = async (signal: {signal: AbortSignal}) => {
        try {
          const {data: {data: {task}}} = await api.post<Success<Code.Created, ResponseTask>>('/tasks', form, signal)
          setTasks(tasks => [...tasks, task])
          setModal('taskCreate', false)
          toast.success('You have a new task : ' + task.title)
        } catch (error) {
          console.error(error)
          if (error instanceof AxiosError && error.code === AxiosError.ERR_CANCELED) toast.info('Action cancelled')
          else toast.error('Task creation failed..')
          throw error
        }
    }

    const onUpdateTaskSubmit = async (taskId: ITask['id'], signal: {signal: AbortSignal}) => {
        try {
          const task = tasks.find(task => task.id === taskId)
          if (!task) throw new Error('Task not found.')
          const {data: {data: {task: taskUpdated}}} = await api.patch<Success<Code.OK, ResponseTask>>('/tasks/' + taskId, formUpdate, signal)
          Object.assign(task, taskUpdated)
          setTasks([...tasks])
          toast.success('Task updated successfully !')
          setModal('taskUpdate', false)
        } catch (error) {
          console.error(error)
          if (error instanceof AxiosError) {
            // const errorTyped = error as AxiosError<{message: string, status: 404, success: false} | {errors: Record<string, string>, status: 400, success: false}>
            if (error.status && error.status > Code.BadRequest && error.status < Code.Failure) {
              toast.error(error.response?.data.message)
              throw error
            }
            else if (error.code === AxiosError.ERR_CANCELED) {
              toast.info('Action cancelled')
              throw error
            }
          }
          toast.error('Task update failed..')
          throw error
        }
    }

    const onDelete = async (taskId: ITask['id']): Promise<boolean | void> => {
      try {
        const task = tasks.find(task => task.id === taskId)
        if (!task) throw new Error('Task not found.')
        const fetchDelete = await api.delete<Success<Code.NoContent, {}>>('/tasks/' + taskId)
        if (fetchDelete.status === Code.NoContent) {
          const taskIndex = tasks.findIndex(task => task.id === taskId)
          if (taskIndex === -1) throw new Error('Cannot find this task.')
          else {
            tasks.splice(taskIndex, 1)
            const animationDuration = 2900
            setTimeout(() => setTasks([...tasks]), animationDuration)
            return true
          }
        }
      } catch (error) {
          console.error(error)
          if (error instanceof AxiosError && error.status) {
            // const errorTyped = error as AxiosError<{message: string, status: 404, success: false} | {errors: Record<string, string>, status: 400, success: false}>
            if (error.status > Code.BadRequest && error.status < Code.Failure) {
              toast.error(error.response?.data.message)
              return
            }
          }
          toast.error('Task deletion failed..')
      }
      }
    

    const onUpdate = async (taskId: ITask['id']) => {
      try {
      const task = tasks.find(task => task.id === taskId)
      if (!task) throw new Error('Task not found.')
      const status = task.status === Status.Pending ? Status.Done : Status.Pending
      const body = {
        status
      }
      const {data: {data: {task: taskUpdated}}} = await api.patch<Success<Code.OK, ResponseTask>>('/tasks/' + taskId, body)
      task.status = taskUpdated.status
      setTasks([...tasks])
      } catch (error) {
          console.error(error)
          if (error instanceof AxiosError && error.status) {
            if (error.status > Code.BadRequest && error.status < Code.Failure) {
              toast.error(error.response?.data.message)
              return
            }
          }
          toast.error('Task update failed..')
      }
    }

    const deleteTasks = async () => {
      try {
        await api.delete<Success<Code.NoContent, {}>>('/tasks')
        setTasks([])
      } catch (error) {
          console.error(error)
          toast.error('Tasks deletion failed..')
      }
    }

    const setFormField = useCallback((field: Partial<TaskContent>) => setForm(prev => ({...prev, ...field})), [])

    const setUpdateFormField = useCallback((field: Partial<TaskContent & Pick<ITask, 'status'>> | keyof (TaskContent & Pick<ITask, 'status'>), remove?: boolean) => {
       setFormUpdate(form => {
        if (remove && typeof field === 'string') {
          delete form[field]
          return form
        }
        else return {...form, ...field as Partial<TaskContent & Pick<ITask, 'status'>>}
       }
      )
    }, [])

    const resetFormFields = () => setForm({title: '', description: ''})

    const resetUpdateFormFields = () => setFormUpdate({})


    return  <main className="w-11/12 mb-14 flex flex-col justify-center items-center gap-y-7">
      {
        isLoading ? <Spinner />  : !tasks.length ? <h3 className="text-xl font-bold text-primary-dark tracking-wide flex flex-col justify-center items-center gap-y-1 cursor-default hover:text-primary">Create your first task<span role="img">&#x2B07;</span></h3> :
      <div className="w-full flex flex-col justify-center items-end gap-y-6">
         {tasks.sort((a, b) => b.status.length - a.status.length).map(task => <Task key={task.id} onDelete={onDelete} onUpdate={onUpdate} taskModal={{form: {onTaskSubmit: onUpdateTaskSubmit, resetFields: resetUpdateFormFields, onChange: setUpdateFormField}, onClose: () => setModal('taskUpdate', false)}} {...task} />
       )}
       <Button className="mr-0.5 rounded-md" onClick={deleteTasks} size="sm" base="destructive"><Trash strokeWidth={.7} size='1.1em' /></Button>
      </div>
}
{!isLoading && <Button onClick={() => setModal('taskCreate', true)} size="lg" className="font-curve" aria-expanded="false" aria-haspopup="dialog" aria-controls="modal">new task</Button>}
{isModalOpen('taskCreate') && <TaskModal onClose={() => setModal('taskCreate', false)} form={{onTaskSubmit: onCreateTaskSubmit, resetFields: resetFormFields, taskExists, onChange: setFormField}} />}
  </main>
}
export default Index;