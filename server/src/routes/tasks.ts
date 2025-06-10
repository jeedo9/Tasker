import { Router } from "express";
import { createTask, deleteTask, getTasks, updateTask, deleteTasks } from "@controllers/tasks/tasks.js";


const tasksRouter = Router()

tasksRouter.route('/').get(getTasks).post(createTask).delete(deleteTasks)

tasksRouter.route('/:taskId').patch(updateTask).delete(deleteTask)

export default tasksRouter;