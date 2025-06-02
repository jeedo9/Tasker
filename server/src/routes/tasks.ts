import { Router } from "express";
import { createTask, deleteTask, getTasks, updateTask } from "../controllers/tasks.js";


const tasksRouter = Router()

tasksRouter.route('/').get(getTasks).post(createTask)

tasksRouter.route('/:taskId').patch(updateTask).delete(deleteTask)

export default tasksRouter;