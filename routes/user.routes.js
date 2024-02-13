import express from 'express';
import { body } from 'express-validator';
import { registerUser,loginUser,verifyEmail } from '../controllers/AuthController.js';
import { getAllUsers, updateUser } from '../controllers/user.controller.js';

const router = express.Router();


router.post('/register', [
    body('username').notEmpty().isLength({ min: 5 }),
    body('email').isEmail(),
    body('password').isLength({ min: 6 })
], registerUser);
router.get('/verify/:token', verifyEmail);

router.post('/login', loginUser);
router.get("/users" , getAllUsers);
router.put("/update/:id" , updateUser)
export default router ;