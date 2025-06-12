import { Code, type ErrorMessage, type ITask, type ResponseTask, type ResponseTasks, type Success, type TaskContent, type TaskInfo, type TaskInfoOptional } from "@shared/types/types"
import api from "@utils/api"
import { AxiosError, type AxiosRequestConfig, type AxiosResponse } from "axios"
import { toast } from "sonner"

type GetTaskResponse = Success<Code.OK, ResponseTasks>
export const getTasks = async (): Promise<void | ITask[]> => {
    try {
    const {data: {data: {tasks}}} = await api.get<GetTaskResponse, AxiosResponse<GetTaskResponse>, undefined>('/tasks')
    return tasks
    } catch (error) {
    console.error(error)
    toast.error('Cannot get your tasks.. Try refresh Tasker.')
}
}

type CreateTaskResponse = Success<Code.Created, ResponseTask>
export const createTask = async (data: TaskContent, config?: AxiosRequestConfig<TaskContent>): Promise<ITask | void> => {
try {
    const {data: {data: {task}}} = await api.post<CreateTaskResponse, AxiosResponse<CreateTaskResponse, CreateTaskResponse>, TaskContent>('/tasks', data, config)
    toast.success('You have a new task : ' + task.title)
    return task
} catch (error) {
    console.error(error)
    if (error instanceof AxiosError && error.code === AxiosError.ERR_CANCELED) toast.info('Action cancelled')
    else toast.error('Task creation failed..')
}
}

type UpdateTaskResponse = Success<Code.OK, ResponseTask>
export const updateTask = async (taskId: ITask['id'], tasks: ITask[], data: TaskInfoOptional, config?: AxiosRequestConfig<TaskInfoOptional>): Promise<ITask | void> => {
    try {
    const task = tasks.find(task => task.id === taskId)
    if (!task) throw new Error('Task not found.')
    const {data: {data: {task: taskUpdated}}} = await api.patch<UpdateTaskResponse, AxiosResponse<UpdateTaskResponse>, TaskInfoOptional>('/tasks/' + taskId, data, config)
    return taskUpdated
} catch (error) {
    console.error(error)
    if (error instanceof AxiosError) {
    const errorTyped = error as AxiosError<ErrorMessage<'update'>, TaskInfoOptional>
    if (errorTyped.status && errorTyped.status < Code.Failure) {
        toast.error(errorTyped.response?.data.message)
        return
    }
    else if (errorTyped.code === AxiosError.ERR_CANCELED) {
        toast.info('Action cancelled')
        return
    }
    }
    toast.error('Task update failed..')
}
}

export const deleteTask = async (taskId: ITask['id'], tasks: ITask[]): Promise<boolean | void> => {
    try {
    const task = tasks.find(task => task.id === taskId)
    if (!task) throw new Error('Task not found.')
    const {status} = await api.delete<undefined, AxiosResponse<undefined>, undefined>('/tasks/' + taskId)
    return status === Code.NoContent
    } catch (error) {
        console.error(error)
        if (error instanceof AxiosError && error.status) {
        const errorTyped = error as AxiosError<ErrorMessage<'delete'>, undefined>
        if (errorTyped.status && errorTyped.status < Code.Failure) {
            toast.error(errorTyped.response?.data.message)
            return
        }
        }
        toast.error('Task deletion failed..')
    }
}

export const deleteTasks = async (): Promise<boolean | void> => {
    try {
    const {status} = await api.delete<undefined, AxiosResponse<undefined>, undefined>('/tasks')
    return status === Code.NoContent
    } catch (error) {
    console.error(error)
    toast.error('Tasks deletion failed..')
    }
}