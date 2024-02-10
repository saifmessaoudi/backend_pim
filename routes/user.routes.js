import express from 'express';
import  {getAll,addInvitation,deleteInvitation} from '../controllers/user.controller.js';

const router = express.Router();



  router.route('/getall')
   .get(getAll)

   router.route('/addinvitation')
   .patch(addInvitation)

   router.route('/deleteInvitation')
   .patch(deleteInvitation)

  export default  router;