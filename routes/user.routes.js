import express from 'express';
import { body } from 'express-validator';
import { registerUser,loginUser,verifyEmail } from '../controllers/AuthController.js';
import { getAllUsers, getById, updatePassword, updateUser } from '../controllers/user.controller.js';

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
router.get("/:id" , getById)
router.put("/updatePassword/:id" , updatePassword)
export default router ;