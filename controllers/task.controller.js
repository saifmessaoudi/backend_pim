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
            state: "to do"
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

export const getTasksByRecipe = async (req, res) => {
    try {
        const { userId } = req.params;

        // Vérifier si l'ID fourni est un ObjectId valide
        if (!mongoose.Types.ObjectId.isValid(userId)) {
            return res.status(400).json({ message: 'Invalid user ID' });
        }

        // Recherche de toutes les tâches avec le champ 'recipient' correspondant à l'ID de l'utilisateur
        const tasks = await Task.find({ recipient: userId });

        // Si aucune tâche n'est trouvée, retourner un message approprié
        if (tasks.length === 0) {
            return res.status(404).json({ message: 'No tasks found for this user' });
        }

        // Retourner les tâches associées à l'ID de l'utilisateur
        res.status(200).json(tasks);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

export const getTaskByState = async (req, res) => {
    try {
        const { state } = req.params; // Obtenir le state du paramètre de requête

        // Recherche des tâches par état
        const tasks = await Task.find({ state });

        // Si aucune tâche n'est trouvée, renvoyer un message approprié
        if (tasks.length === 0) {
            return res.status(404).json({ message: `No tasks found with state: ${state}` });
        }

        // Renvoyer toutes les tâches correspondant à l'état donné
        res.status(200).json(tasks);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
};
