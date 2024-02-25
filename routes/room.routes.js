import { Router } from "express";

import { addRoom,addRoomInvitation,deleteRoomInvitation,getAllRooms} from '../controllers/room.controller.js';

const roomrouter = Router();

roomrouter.route('/addroom')
.post(addRoom)
/*

movierouter.route('/toprated')
.get(toprated)

movierouter.route('/trendingMovies')
.get(trendingMovies)
*/

roomrouter.route('/addroominvitation')
.patch(addRoomInvitation)

roomrouter.route('/deleteroominvitation')
.patch(deleteRoomInvitation)

roomrouter.route('/getRooms')
.get(getAllRooms)

export default  roomrouter;
