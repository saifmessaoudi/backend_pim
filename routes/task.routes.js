import { Router } from 'express';
import { body, validationResult } from 'express-validator';
import {
    createTask,
    getAllTasks,
    getTaskById,
    getTasksByRecipe,
    getTaskByState,
    updateState
} from '../controllers/task.controller.js';

const routerTask = Router();

routerTask.post("/newtask", createTask);
routerTask.get("/tasks", getAllTasks);
routerTask.get("/:id", getTaskById)
routerTask.get("/user/:userId", getTasksByRecipe)
routerTask.put('/:id/state', updateState);
routerTask.get('/tasks/state/:state', getTaskByState);

export default  routerTask;

