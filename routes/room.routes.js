import { Router } from "express";

import { addRoom,addRoomInvitation,deleteRoomInvitation,getAllRooms,addaUserAccess,deleteUserAccess,addChatAccess,deleteChatAccess,addOwnerAccess,deleteOwnerAccess,deleteRoom} from '../controllers/room.controller.js';

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

roomrouter.route('/addAccess')
.patch(addaUserAccess)
roomrouter.route('/addOwnerAccess')
.patch(addOwnerAccess)
roomrouter.route('/deleteOwnerAccess')
.patch(deleteOwnerAccess)
roomrouter.route('/deleteAccess')
.patch(deleteUserAccess)
roomrouter.route('/addChatAccess')
.patch(addChatAccess)
roomrouter.route('/deleteChataccess')
.patch(deleteChatAccess)
roomrouter.route('/deleteRoom')
.delete(deleteRoom) 


export default  roomrouter;
