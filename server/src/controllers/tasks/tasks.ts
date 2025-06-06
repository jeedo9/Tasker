import type {Response, RequestHandler} from "express-serve-static-core";
import { generateId} from "@utils/helpers.js";
import { errorMessages } from "@utils/constants.js";
import { Code } from "@shared/types/types.js";
import type {ResponseTasks, ResponseTask, TaskContent, ITask, Success} from "@shared/types/types.js"
import { Status } from "@shared/types/types.js";
import {type SuccessOrError, type ErrorType, error, success, type CodeResponse } from "@utils/response.js";
import {createTaskSchema} from '@shared/validators/schemas.js'
import { patchTaskSchema } from "./tasks.validators.js";

type TaskIdParam = {
    taskId: string
}

let tasks: ITask[] = [];


export const getTasks: RequestHandler<{}, Success<Code.OK, ResponseTasks>> = (_, res: Response<Success<Code.OK, ResponseTasks>, {}, CodeResponse<'read'>>) => {res.json(success(Code.OK, {tasks}))}

export const createTask: RequestHandler<{}, SuccessOrError<Success<Code.Created, ResponseTask>, 'create'>>  = (req, res: Response<SuccessOrError<Success<Code.Created, ResponseTask>, 'create'>, {}, CodeResponse<'create'>>) => {

    const bodyParsed = createTaskSchema.safeParse(req.body)
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
    const task = Object.assign<Omit<ITask, keyof TaskContent>, TaskContent>({
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