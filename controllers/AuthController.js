import UserModel from "../models/user.model.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { validationResult } from 'express-validator';






export const registerUser = async (req, res) => {
    try {
        const { username, password ,email } = req.body;

        
        const existingUser = await UserModel.findOne({ username });
        const existing = await UserModel.findOne({email}); 

        if (existingUser&&existing) {
            return res.status(400).json({ message: "User already exists" });
        }

      
        const hashedPassword = await bcrypt.hash(password, 10);

       
        const newUser = new UserModel({
          username: req.body.username,
          email: req.body.email,
            password: hashedPassword
        });

        
        const user = await newUser.save();
        

        const token = jwt.sign(
            { username: user.username, id: user._id },
            process.env.JWT_KEY, 
            { expiresIn: "1h" }
        );

    
        res.status(200).json({ user, token });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};


    
