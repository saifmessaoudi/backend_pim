import { Router } from "express";
import { sendPasswordResetEmail , verifyUserWithGoogle } from "../controllers/user.controller.js";
import bcrypt from "bcrypt";
import User from "../models/user.model.js";
import sendEmail from "../utils/mailer.js";
import { body } from 'express-validator';
import { registerUser,loginUser,verifyEmail } from '../controllers/AuthController.js';
import { getAllUsers, getById, updatePassword, updateUser } from '../controllers/user.controller.js';
import  {getAll,addInvitation,deleteInvitation} from '../controllers/user.controller.js';

const router = Router();

router.post ('/reset-password', sendPasswordResetEmail);

router.get('/reset-password/:token', (req, res) => {
    const token = req.params.token;
    res.render('reset-password', { token });
});

router.post("/change-password", async (req, res) => {
    const newPassword = req.body.password;
    const { token} = req.body;
    console.log(token, newPassword);
    try {
        // Validate token and find user by token
        const user = await User.findOne({ resetVerificationToken: token });

        if (!user) {
            return res.status(400).json({ message: "Invalid or expired token" });
        }


    
        const hashedPassword = await bcrypt.hash(newPassword, 10);
        
        user.password = hashedPassword;

        await user.save();

        res.status(200).json({ message: "Password reset successfully" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal server error" });
    }
});

router.post('/verify-google', verifyUserWithGoogle);

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

  router.route('/getall')
   .get(getAll)

   router.route('/addinvitation')
   .patch(addInvitation)

   router.route('/deleteInvitation')
   .patch(deleteInvitation)



  export default  router;
