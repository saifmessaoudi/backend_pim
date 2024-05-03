import { Router } from "express";

import { extractData } from "../controllers/tesseract.controller.js";
const tesseractrouter = Router();



tesseractrouter.route('/extractData')
.post(extractData)

export default  tesseractrouter;