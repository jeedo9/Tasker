import {useCallback, useEffect, useState } from "react";
import Button from "@components/ui/Button";
import PostTaskModal from "./components/PostTaskModal";
import Task from "./components/Task";
import api from "@utils/api";
import type { ITask, ResponseTask, ResponseTasks, TaskContent, Success } from "@shared/types/types";
import useModal from "@contexts/modal/useModal";
import { Status, Code } from "@shared/types/types";
import { toast } from "sonner";
import { AxiosError } from "axios";
import Spinner from "@components/ui/Spinner";


const Index = () => {
  const [tasks, setTasks] = useState<ITask[]>([])
    const [form, setForm] = useState<TaskContent>({
      title: '',
      description: ''
    })
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

    const taskExists = useCallback((taskTitle: string) => {
      const exists = tasks.some(task => task.title === taskTitle)
      return exists
    }, [tasks])



    const onTaskSubmit = useCallback(async () => {
        try {
          const {data: {data: {task}}} = await api.post<Success<Code.Created, ResponseTask>>('/tasks', form)
          setTasks(tasks => [...tasks, task])
          setModal(null)
          toast.success('You have a new task : ' + task.title)
        } catch (error) {
          console.error(error)
          toast.error('Task creation failed..')
        }

    }, [form, setModal])

    const onDelete = async (taskId: ITask['id']): Promise<boolean | void> => {
      try {
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

    const setFormField = (field: Partial<Record<keyof TaskContent, string>>) => setForm(prev => ({...prev, ...field}))

      useEffect(() => {
      if (isModalOpen) setModal(<PostTaskModal onClose={() => setModal(null)} form={{onTaskSubmit, taskExists, resetFields: () => setForm({title: '', description: ''}), onChange: setFormField}} />)
    }, [setModal, onTaskSubmit,taskExists, isModalOpen])

    if (isLoading) return <Spinner />
    return  <main className="w-11/12 flex flex-col justify-center items-center gap-y-7">
      {!tasks.length ? <h3 className="text-xl font-bold text-primary-dark tracking-wide flex flex-col justify-center items-center gap-y-1 cursor-default hover:text-primary">Create your first task<span role="img">&#x2B07;</span></h3> : tasks.map(task => <Task key={task.id} onDelete={onDelete} onUpdate={onUpdate} {...task} />
       )}
    <Button onClick={() => setModal(<PostTaskModal onClose={() => setModal(null)} form={{onTaskSubmit,resetFields: () => setForm({title: '', description: ''}),taskExists, onChange: setFormField}} />)} size="lg" className="font-curve" aria-expanded="false" aria-haspopup="dialog" aria-controls="modal">new task</Button>
  </main>
}
export default Index;