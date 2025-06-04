import type {Response, RequestHandler} from "express-serve-static-core";
import { generateId} from "../utils/helpers.js";
import { z } from "zod";
import { errorMessages } from "../utils/constants.js";
import { Code } from "../types/index.d.js";
import {type ITask} from '../../../shared/types/types.js'
import {type Success, type SuccessOrError, type ErrorType, error, success, type CodeResponse } from "../utils/response.js";

let tasks: ITask[] = [];

// Should be placed in shared folder
export enum Status {
    Pending = 'pending',
    Done = 'done'
}

type ResponseTasks = {tasks: ITask[]}
type ResponseTask = {task: ITask}
type TaskIdParam = {
    taskId: string
}

const postTaskSchema = z.strictObject({
    title: z.string({message: 'A title is required to create your task'}).min(2, 'Title field should be at least 2 characters please'),
    description: z.string().optional()
})

type PostTask = z.infer<typeof postTaskSchema>

const patchTaskSchema = z.object({
    status: z.enum([Status.Pending, Status.Done])
}).strict('You can only update the status of your task.')

export const getTasks: RequestHandler<{}, Success<Code.OK, ResponseTasks>> = (_, res: Response<Success<Code.OK, ResponseTasks>, {}, CodeResponse<'read'>>) => {res.json(success(Code.OK, {tasks}))}

export const createTask: RequestHandler<{}, SuccessOrError<Success<Code.Created, ResponseTask>, 'create'>>  = (req, res: Response<SuccessOrError<Success<Code.Created, ResponseTask>, 'create'>, {}, CodeResponse<'create'>>) => {

    const bodyParsed = postTaskSchema.safeParse(req.body)
    if (!bodyParsed.success) {
        const {errors} = bodyParsed.error
        const errorsObj = Object.fromEntries(errors.map(error => [error.path[0], error.message]))
        res.status(Code.BadRequest).json(error(400, errorsObj))
        return
    }
    const {data} = bodyParsed
    const taskExists = tasks.some(task => task.title === data.title)
    if (taskExists) {
        res.status(Code.Conflict).json(error<'create'>(409, errorMessages.conflict))
        return
    }
    const task = Object.assign<Omit<ITask, keyof PostTask>, PostTask>({
        id: generateId(),
        status: Status.Pending,
    }, data)
    tasks.push(task)
    res.status(Code.Created).json(success(Code.Created, {task}))
}

export const updateTask: RequestHandler<TaskIdParam, SuccessOrError<Success<Code.OK, ResponseTask>, 'update'>>  = (req, res: Response<SuccessOrError<Success<Code.OK, ResponseTask>, 'update'>, {}, CodeResponse<'update'>>) => {
    const {taskId} = req.params
    const task = tasks.find(task => task.id === taskId)
    if (!task) {
        res.status(Code.NotFound).json(error(Code.NotFound, errorMessages.notFound))
        return
    }
    const bodyParsed = patchTaskSchema.safeParse(req.body)
    if (!bodyParsed.success) {
        const {errors} = bodyParsed.error
        const errorsObj = Object.fromEntries(errors.map(error => [error.path[0], error.message]))
        res.status(Code.BadRequest).json(error(400, errorsObj))
        return
    }
    const {status} = bodyParsed.data
    task.status = status
    res.json(success(Code.OK, {task}))
}

export const deleteTask: RequestHandler<TaskIdParam, ErrorType<'delete'>> = (req, res: Response<ErrorType<'delete'>, {}, CodeResponse<'delete'>>) => {
    const {taskId} = req.params
    const {length: tasksLengthBefore} = tasks
    tasks = tasks.filter(task => task.id !== taskId)
    const {length: tasksLengthAfter} = tasks
    if (tasksLengthAfter < tasksLengthBefore) res.sendStatus(Code.NoContent)
    else res.status(Code.NotFound).json(error<'delete'>(404, errorMessages.notFound))
}