import jwt from "jsonwebtoken";
import mongoose from "mongoose";
import usermodel from "../models/user.model.js";
import bcrypt from 'bcrypt';


const User = usermodel;

export const getAllUsers = async (req, res) => {
    try {
        const users = await User.find().select("-password");
        if (users.length === 0) {
            return res.status(400).json("No users found");
        }
        res.status(200).json(users);
    } catch (error) {
        res.status(404).json({ message: error.message });
    }
};

export const getById = async (req, res) => {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) return res.status(404).send(`No user with id: ${id}`);
    try {
        const user = await User.findById(id).select("-password");
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        res.status(200).json(user);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const updateUser = async (req, res) => {
    const { id } = req.params;
    const { username, firstName, lastName, birthDate, bio } = req.body;
    if (!mongoose.Types.ObjectId.isValid(id)) return res.status(404).send(`No user with id: ${id}`);
    const updatedUser = { username, firstName, lastName, birthDate, bio };
    await User.findByIdAndUpdate(id, updatedUser, { new: true });
    res.json(updatedUser);
};

export const updatePassword = async (req, res) => {
    try {
        const id = req.params.id;
        const oldPassword = req.body.oldPassword;
        const newPassword = req.body.newPassword;
        
        const user = await User.findById(id);
        
        if (!user) {
            return res.status(400).json({ message: "User does not exist" });
        }
        
        // Vérifiez si l'ancien mot de passe correspond
        const isPasswordValid = await bcrypt.compare(oldPassword, user.password);
        if (!isPasswordValid) {
            return res.status(400).json({ message: "Old password is incorrect" });
        }

        // Si l'ancien mot de passe est correct, mettez à jour le mot de passe
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(newPassword, salt);
        const updatedUser = { password: hashedPassword, passwordResetToken: null };
        await User.findOneAndUpdate({ _id: id }, updatedUser);
        
        res.status(200).json({ message: "Password reset successfully" });
    } catch (error) {
        res.status(400).json(error.message);
    }
};
