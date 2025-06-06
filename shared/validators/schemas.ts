import {z} from 'zod'


export const createTaskSchema = z.strictObject({
    title: z.string({message: 'A title is required to create your task'}).min(2, 'Title field should be at least 2 characters please'),
    description: z.string().optional()
})

export const titleTaskSchema = createTaskSchema.shape.title

// export type CreateTask = z.infer<typeof createTaskSchema>