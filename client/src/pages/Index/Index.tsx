import {useEffect, useState } from "react";
import Button from "@components/ui/Button";
import TaskModal from "./components/TaskModal";
import Task from "./components/Task";
import { Status, type ITask, type TaskContent, type TaskInfo, type TaskInfoOptional} from "@shared/types/types";
import useModal from "@contexts/modal/useModal";
import Spinner from "@components/ui/Spinner";
import { BiTrash as Trash} from "react-icons/bi";
import {deleteTasks, deleteTask, createTask, updateTask, getTasks} from "./services/tasks";

const Index = () => {
  const [tasks, setTasks] = useState<ITask[]>([])
  const [form, setForm] = useState<TaskContent>({
      title: '',
      description: ''
    })
  const [formUpdate, setFormUpdate] = useState<TaskInfoOptional>({})
  const {setModal, isModalOpen} = useModal()
  const [isLoading, setIsLoading] = useState(true)

    useEffect(() => {
      async function getAllTasks() {
          const tasks = await getTasks()
          if (!tasks) {
            setIsLoading(false)
            return
          }
          setTasks(tasks)
          setIsLoading(false)
      }
      getAllTasks()
    }, [])

    const taskExists = (taskTitle: string) => {
      const exists = tasks.some(task => task.title === taskTitle)
      return exists
    }

    const onCreateTaskSubmit = async (signal: {signal: AbortSignal}) => {
          const newTask = await createTask(form, signal)
          if (!newTask) return false
          setTasks(tasks => [...tasks, newTask])
          return true
    }

    const onUpdateTaskSubmit = async (taskId: ITask['id'], signal: {signal: AbortSignal}) => {
          const taskUpdated = await updateTask(taskId, tasks, formUpdate, signal)
          if (!taskUpdated) return false
          const task = tasks.find(task => task.id === taskId)!
          Object.assign(task, taskUpdated)
          setTasks([...tasks])
          return true
    }

    const onDelete = async (taskId: ITask['id']) => {
        const deleted = await deleteTask(taskId, tasks)
        if (deleted) {
          console.log('yes')
          const taskIndex = tasks.findIndex(task => task.id === taskId)

          tasks.splice(taskIndex, 1)
          const animationDuration = 2900
          setTimeout(() => setTasks([...tasks]), animationDuration)
        }
        return Boolean(deleted)
  }
    

    const onUpdate = async (taskId: ITask['id'], status: ITask['status']) => {
      const body = {
        status: status === Status.Done ? Status.Pending : Status.Done
      }
      const taskUpdated = await updateTask(taskId, tasks, body)
      if (!taskUpdated) return
      const task = tasks.find(task => task.id === taskId)!
      task.status = taskUpdated.status
      setTasks([...tasks])
    }

    const onDeleteTasks = async () => {
        const deleted = await deleteTasks()
        if (deleted) setTasks([])
    }

    const setFormField = (field: Partial<TaskContent>) => setForm(prev => ({...prev, ...field}))

    const setUpdateFormField = (field: TaskInfoOptional | keyof TaskInfo, remove?: boolean) => {
       setFormUpdate(form => {
        if (remove && typeof field === 'string') {
          delete form[field]
          return form
        }
        else return {...form, ...field as TaskInfoOptional}
       }
      )
    }
    
    const resetFormFields = () => setForm({title: '', description: ''})

    const resetUpdateFormFields = () => setFormUpdate({})

    return  <main className="xl:w-[72%] w-11/12 mb-14 flex flex-col justify-center items-center gap-y-7">
      {
        isLoading ? <Spinner />  : !tasks.length ? <h3 className="text-xl lg:text-2xl font-bold text-primary-dark tracking-wide flex flex-col justify-center items-center gap-y-1 cursor-default hover:text-primary">Create your first task<span role="img">&#x2B07;</span></h3> :
      <div className="w-full flex flex-col justify-center items-end gap-y-6">
         {tasks.sort((a, b) => b.status.length - a.status.length).map(task => <Task key={task.id} onDelete={onDelete} onUpdate={onUpdate} taskModal={{form: {onTaskSubmit: onUpdateTaskSubmit, resetFields: resetUpdateFormFields, onChange: setUpdateFormField}, onClose: () => setModal('taskUpdate', false)}} {...task} />
       )}
       <Button className="mr-0.5 rounded-md" onClick={onDeleteTasks} size="sm" base="destructive"><Trash strokeWidth={.7} size='1.1em' /></Button>
      </div>
}
{!isLoading && <Button onClick={() => setModal('taskCreate', true)} size="lg" className="font-curve" aria-expanded="false" aria-haspopup="dialog" aria-controls="modal">new task</Button>}
{isModalOpen('taskCreate') && <TaskModal<'create'> type="create" onClose={() => setModal('taskCreate', false)} form={{onTaskSubmit: onCreateTaskSubmit, resetFields: resetFormFields, taskExists, onChange: setFormField}} />}
  </main>
}
export default Index;