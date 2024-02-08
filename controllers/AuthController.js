import UserModel from "../models/user.model.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { validationResult } from 'express-validator';






export const registerUser = async (req, res) => {
    try {
        const { username, password ,ema } = req.body;

        
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


    

export const loginUser = async (req, res) => {
  const { email, username, password } = req.body;


  const errors = validationResult(req);
  if (!errors.isEmpty()) {
      return res.status(422).json({ errors: errors.array() });
  }

  try {
      
      const user = await UserModel.findOne({
          $or: [
              { email: email },
              { username: username }
          ]
      });

      if (req.user && req.user.googleId) {
          return res.status(200).json({ message: 'Successfully logged in with Google', user: req.user });
      }

      if (!user) {
          return res.status(401).json({ message: 'Invalid email or password' });
      }

      if (user.banned === 'banned') {
          return res.status(403).json({ message: 'Your account is banned' });
      }

      const validPassword = await bcrypt.compare(password, user.password);
      if (!validPassword) {
          return res.status(401).json({ message: 'Invalid email or password' });
      }

      const secretKey = process.env.JWT_SECRET || 'defaultSecret';
      const token = jwt.sign(
          {
              userId: user._id,
              username: user.username,
              email: user.email,
              role: user.role,
            
          },
          secretKey,
          { expiresIn: '1h' }
      );

      res.json({ token, user });
  } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Internal server error' });
  }
};


