import { Router } from "express";
import { acceptInvitation, getfriendsRequest, refuseInvitation  } from "../controllers/user.controller.js";
import { banUser, getAllUsersAdmin, getUserById, sendPasswordResetEmail , unbanUser, verifyUserWithGoogle } from "../controllers/user.controller.js";
import bcrypt from "bcrypt";
import User from "../models/user.model.js";
import sendEmail from "../utils/mailer.js";
import { body } from 'express-validator';
import { registerUser,loginUser,verifyEmail } from '../controllers/AuthController.js';
import { getAllUsers, getById, updatePassword, updateUser } from '../controllers/user.controller.js';
import { imageUploadMiddleware } from "../middlewares/multer-config.js";

import  {getAll,addInvitation,deleteInvitation,getFriendsById,acceptInvitation ,deleteUser} from '../controllers/user.controller.js';
import  {addMovieGenders,deleteMovieGenders,getGendersById} from '../controllers/user.controller.js';

const router = Router();
const upload = imageUploadMiddleware("profilePicture",{ fileSize: 1024 * 1024 * 5 });

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
    router.put("/update/:id",upload , updateUser);
router.post('/login', loginUser);
router.get("/users" , getAllUsers);
router.get("/:id" , getById)
router.put("/updatePassword/:id" , updatePassword)

  router.route('/')
   .get(getAll)

   router.route('/getgenders/:sender')
   .get(getGendersById)

   router.route('/getfriends/:sender')
   .get(getFriendsById)

   router.route('/addinvitation')
   .patch(addInvitation)

   router.route('/acceptinvitation')
   .patch(acceptInvitation)

   router.route('/addgender')
   .patch(addMovieGenders)

   router.route('/deletegender')
   .patch(deleteMovieGenders)

   router.route('/deleteInvitation')
   .patch(deleteInvitation)

   router.route('/acceptinvitation')
   .patch(acceptInvitation)

   router.route('/refuseinvitation')
   .patch(refuseInvitation)
   router.route('/getfriendsrequests/:recipient')
   .get(getfriendsRequest) 


   router.delete('/deleteUser/:username', deleteUser);
   
   router.get("/users",getAllUsersAdmin);
   router.get('/user/:id', getUserById);
   router.put('/ban/:id', banUser );
   router.put('/unban/:id', unbanUser);
  export default  router;
