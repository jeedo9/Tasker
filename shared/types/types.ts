export type RemoveS<T extends string> = T extends `${infer K}s` ? K : T

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
