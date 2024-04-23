import { Router } from 'express';
import { body, validationResult } from 'express-validator';
import {
    createTask,
    getAllTasks,
} from '../controllers/task.controller.js';

const routerTask = Router();

routerTask.post("/newtask", createTask);
routerTask.get("/tasks", getAllTasks);


export default  routerTask;

