<<<<<<< HEAD
import express from 'express';
import { createPlan, getAllPlans, getPlanById, updatePlan, deletePlan } from '../controllers/plan.controller.js';

const router = express.Router();

// Route pour créer un nouveau plan
router.post('/', createPlan);

// Route pour obtenir tous les plans
router.get('/', getAllPlans);

// Route pour obtenir un plan par ID
router.get('/:id', getPlanById);

// Route pour mettre à jour un plan
router.put('/:id', updatePlan);

// Route pour supprimer un plan
router.delete('/:id', deletePlan);

export default router;
=======
import { Router } from "express";
import { getPlans } from "../controllers/plan.controller.js";

const planRouter = Router();

planRouter.get("/", getPlans);

export default planRouter;
>>>>>>> 6246832901513bf198eb42032b3b978e56a06d60
