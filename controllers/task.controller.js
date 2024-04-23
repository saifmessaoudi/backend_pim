import Task from '../models/task.model.js'; // Votre modèle Task
import mongoose from 'mongoose';

// Créer une nouvelle tâche
export const createTask = async (req, res) => {
    try {
        const { title, releaseDate, description, recipient } = req.body;

        const newTask = new Task({
            title,
            releaseDate,
            description,
            recipient,
        });

        const savedTask = await newTask.save();

        res.status(201).json({ message: 'Task created successfully', task: savedTask });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

// Récupérer toutes les tâches
export const getAllTasks = async (req, res) => {
    try {
        const tasks = await Task.find().populate('recipient'); // Utilisation de populate pour obtenir des détails sur le destinataire
        res.status(200).json(tasks);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

// Récupérer une tâche par son ID
export const getTaskById = async (req, res) => {
    try {
        const { id } = req.params;

        const task = await Task.findById(id).populate('recipient');

        if (!task) {
            return res.status(404).json({ message: 'Task not found' });
        }

        res.status(200).json(task);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

// Mettre à jour une tâche par son ID
export const updateTask = async (req, res) => {
    try {
        const { id } = req.params;
        const { title, releaseDate, description, recipient } = req.body;

        const updatedTask = await Task.findByIdAndUpdate(
            id,
            {
                title,
                releaseDate,
                description,
                recipient: mongoose.Types.ObjectId(recipient),
            },
            { new: true } // Renvoie la tâche mise à jour
        );

        if (!updatedTask) {
            return res.status(404).json({ message: 'Task not found' });
        }

        res.status(200).json({ message: 'Task updated successfully', task: updatedTask });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

// Supprimer une tâche par son ID
export const deleteTask = async (req, res) => {
    try {
        const { id } = req.params;

        const deletedTask = await Task.findByIdAndDelete(id);

        if (!deletedTask) {
            return res.status(404).json({ message: 'Task not found' });
        }

        res.status(200).json({ message: 'Task deleted successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
};
