import { Router } from 'express';
import { body, validationResult } from 'express-validator';
import {
    createTask,
} from '../controllers/task.controller.js';

const routerTask = Router();

routerTask.post("/newtask", createTask);

export default  routerTask;

