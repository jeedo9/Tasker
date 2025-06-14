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

export const getTasks: RequestHandler<{}, Success<Code.OK, ResponseTasks>> = (_, res: Response<Success<Code.OK, ResponseTasks>, {}, CodeResponse<'read'>>) => {
    tasks.sort((a, b) => b.status.length - a.status.length)
    res.json(success(Code.OK, {tasks}))
}

export const createTask: RequestHandler<{}, SuccessOrError<Success<Code.Created, ResponseTask>, 'create'>>  = (req, res: Response<SuccessOrError<Success<Code.Created, ResponseTask>, 'create'>, {}, CodeResponse<'create'>>) => {

    const bodyParsed = createTaskSchema.safeParse(req.body)
    if (!bodyParsed.success) {
        const {errors} = bodyParsed.error
        const errorsObj = Object.fromEntries(errors.map(error => [error.path[0], error.message]))
        res.status(Code.BadRequest).json(error(Code.BadRequest, errorsObj))
        return
    }
    const {data} = bodyParsed
    const taskExists = tasks.some(task => task.title === data.title)
    if (taskExists) {
        res.status(Code.Conflict).json(error<'create'>(Code.Conflict, errorMessages.conflict))
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
        res.status(Code.BadRequest).json(error(Code.BadRequest, errorsObj))
        return
    }
    const {data: updatedData} = bodyParsed
    const taskExits = tasks.some(task => task.title === updatedData.title)
    if (taskExits) {
        res.status(Code.Conflict).json(error(Code.Conflict, 'You cannot update your task with the same title or with a title already used by another task'))
        return
    }
    // Verify if updatedData has field(s) that have not been changed and send a message (No changes detected)...
    Object.assign(task, updatedData)
    res.json(success(Code.OK, {task}))
}


export const deleteTask: RequestHandler<TaskIdParam, ErrorType<'delete'>> = (req, res: Response<ErrorType<'delete'>, {}, CodeResponse<'delete'>>) => {
    const {taskId} = req.params
    const {length: tasksLengthBefore} = tasks
    tasks = tasks.filter(task => task.id !== taskId)
    const {length: tasksLengthAfter} = tasks
    if (tasksLengthAfter < tasksLengthBefore) res.sendStatus(Code.NoContent)
    else res.status(Code.NotFound).json(error<'delete'>(Code.NotFound, errorMessages.notFound))
}

export const deleteTasks: RequestHandler<TaskIdParam, ErrorType<'delete'>>  = (req, res: Response<ErrorType<'delete'>, {}, CodeResponse<'delete'>>) => {
    tasks = [];
    res.sendStatus(Code.NoContent)
}