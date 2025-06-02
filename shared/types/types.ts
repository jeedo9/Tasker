import { Status } from "../../server/src/controllers/tasks";

export type RemoveS<T extends string> = T extends `${infer K}s` ? K : T

export interface Task {
    id: string, 
    title: string,
    description?: string,
    status: Status,
}