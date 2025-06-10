import {z} from 'zod'
import { Status } from '@shared/types/types.js'


// export const patchTaskSchema = createTaskSchema.extend({
//     status: z.enum([Status.Pending, Status.Done])
// })

export const createTaskSchema = z.strictObject({
    title: z.string({message: 'A title is required to create your task'}).min(2, 'Title field should be at least 2 characters please'),
    description: z.string().optional()
})

const patchTaskSchema_ = z.strictObject({
    status: z.enum([Status.Pending, Status.Done])
}).merge(createTaskSchema).partial()

const {options: patchTaskSchemaOptions} = patchTaskSchema_.keyof()

export const patchTaskSchema = patchTaskSchema_.refine(data => new Map(Object.entries(data)).size, 'You should provide a data to update your task : ' + patchTaskSchemaOptions.join(' or '))