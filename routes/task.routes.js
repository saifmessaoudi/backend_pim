import { Router } from 'express';
import { body, validationResult } from 'express-validator';
import {
    createTask,
    getAllTasks,
    getTaskById,
} from '../controllers/task.controller.js';

const routerTask = Router();

routerTask.post("/newtask", createTask);
routerTask.get("/tasks", getAllTasks);
routerTask.get("/:id", getTaskById)


export default  routerTask;

