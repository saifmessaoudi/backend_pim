import jwt from "jsonwebtoken";
import mongoose from "mongoose";
import usermodel from "../models/user.model.js";

const User = usermodel;

/*----------------------------------- GET --------------------------------------- */

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
    const { username, firstName, lastName, email, birthDate, bio } = req.body;
    if (!mongoose.Types.ObjectId.isValid(id)) return res.status(404).send(`No user with id: ${id}`);
    const updatedUser = { username, firstName, lastName, email, birthDate, bio };
    await User.findByIdAndUpdate(id, updatedUser, { new: true });
    res.json(updatedUser);
};
