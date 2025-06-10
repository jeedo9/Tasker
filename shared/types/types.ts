import type { SuccessReturnType } from "../../server/src/utils/response.js"

export enum Status {
    Pending = 'pending',
    Done = 'done'
}

export interface ITask {
    id: string, 
    title: string,
    description?: string,
    status: Status,
}
export type TaskContent = Pick<ITask, 'description' | 'title'>

export type ResponseTasks = {tasks: ITask[]}
export type ResponseTask = {task: ITask}

export type Success<T extends SuccessReturnType['status'], K extends SuccessReturnType['data']> = {
    status: T,
    data: K,
    success: true
}
export type RemoveS<T extends string> = T extends `${infer K}s` ? K : T

export enum Code {
    OK = 200,
    Created = 201,
    NoContent = 204,
    BadRequest = 400,
    NotFound = 404,
    Conflict = 409,
    Failure = 500
}