import {z} from 'zod'
import { Status } from '@shared/types/types.js'

export const patchTaskSchema = z.object({
    status: z.enum([Status.Pending, Status.Done])
}).strict('You can only update the status of your task.')