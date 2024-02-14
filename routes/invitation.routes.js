import express from 'express';
import {addInvitation,removeInvitation} from '../controllers/invitation.controller.js';

const router = express.Router();


router
  .route('/addinvitation')
  .post(addInvitation)

  router
  .route('/deleteinvitation')
  .delete(removeInvitation)

  export default  router;