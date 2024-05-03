import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { validationResult } from 'express-validator';
import UserModel from '../models/user.model.js';
import sendEmail from '../utils/mailer.js';
import generateVerificationToken from '../controllers/generateVerificationToken.js';

export const registerUser = async (req, res) => {
    try {
        const { username, password, email } = req.body;

        const existingUser = await UserModel.findOne({ username });
        const existing = await UserModel.findOne({ email });

        if (existingUser && existing) {
            return res.status(400).json({ message: "User already exists" });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = new UserModel({
            username: req.body.username,
            email: req.body.email,
            password: hashedPassword
        });

        const user = await newUser.save();

        const authToken = jwt.sign(
            { username: user.username, id: user._id },
            process.env.JWT_SECRET,
            { expiresIn: "1h" }
        );

        const verificationToken = generateVerificationToken();
        newUser.verificationToken = verificationToken;
        await newUser.save();

        const verificationLink = `${process.env.BASE_URL}/verify/${verificationToken}`;
        const emailSubject = 'Email Verification';
        const emailHtml = `Click the following link to verify your email: <a href="${verificationLink}">Verify Email</a>`;
        await sendEmail(newUser.email, emailSubject, emailHtml);

        res.status(200).json({ user: newUser, authToken, message: 'User registered successfully. Please check your email for verification.' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const verifyEmail = async (req, res) => {
    try {
        const token = req.params.token;
        console.log('Received token:', token);

        // Ensure that the token is not empty or undefined
        if (!token) {
            return res.status(400).json({ message: 'Invalid verification token' });
        }

        const user = await UserModel.findOne({ verificationToken: token });
        console.log('User found:', user);

        if (!user) {
            return res.status(400).json({ message: 'Invalid verification token' });
        }

        // Check if the user is already verified
        if (user.isVerified) {
            return res.status(200).json({ message: 'Email already verified' });
        }

        user.isVerified = true;
        user.verificationToken = null; // Optionally clear the token after verification
        await user.save();

        res.status(200).json({ message: 'Email verification successful' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
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


export const loginAdmin = async (req, res) => {
    try {
        const { email, username, password } = req.body;

        const user = await UserModel.findOne({
            $or: [
                { email: email },
                { username: username }
            ]
        });

        if (!user) {
            return res.status(401).json({ message: 'Invalid email or password' });
        }
      
        if (!user.role.toLowerCase().includes('admin')) {
            return res.status(403).json({ message: 'You are not authorized to access this resource' });
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
export const loginUser1 = async (req, res) => {
    const { email, password } = req.body;

    // Validation des entrées
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(422).json({ errors: errors.array() });
    }

    try {
        const user = await UserModel.findOne({ email });

        if (!user) {
            return res.status(401).json({ message: 'Invalid email or password' });
        }

        if (user.banned === 'banned' ) {
            return res.status(403).json({ message: 'Your account is banned' });
        }

        const validPassword = await bcrypt.compare(password, user.password);
        if (!validPassword) {
            return res.status(401).json({ message: 'Invalid email or password' });
        }
       
        const secretKey = process.env.JWT_SECRET || 'defaultSecret'; // Utilisez votre propre clé secrète ici
        const token = jwt.sign(
            {
                userId: user._id,
                username: user.username,
                email: user.email,
                role: user.role,
                token:user.JWT_KEY // Ajoutez d'autres informations utilisateur au besoin
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