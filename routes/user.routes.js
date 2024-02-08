import express from 'express';
import { body } from 'express-validator';
import { registerUser,loginUser } from '../controllers/AuthController.js';



const router = express.Router();


router.post('/register', [
    body('username').notEmpty().isLength({ min: 5 }),
    body('email').isEmail(),
    body('password').isLength({ min: 6 })
], registerUser);


router.post('/login', loginUser);
export default router ;