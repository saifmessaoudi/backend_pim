import { Router } from "express";
import { createReclamation , deleteReclamation , getAllReclamations} from "../controllers/reclamation.controller.js";





//import { sendSMS } from "../utils/sms.js";


const reclamationRouter = Router();

//reclamationRouter.post('/send-sms', sendSMS);

reclamationRouter.post('/create-reclamation', createReclamation);

reclamationRouter.get("/reclamations" , getAllReclamations);

reclamationRouter.delete('/delete-reclamation/:id', deleteReclamation);

export default reclamationRouter;
