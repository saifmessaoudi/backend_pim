import { Router } from "express";

import { getnotifcationtv,addRoomInvitationtv,addRoom,getroombyid,addRoomInvitation,deleteRoomInvitation,getAllRooms,addaUserAccess,deleteUserAccess,addChatAccess,deleteChatAccess,addOwnerAccess,deleteOwnerAccess} from '../controllers/room.controller.js';

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
roomrouter.route('/getroom/:roomId')
.get(getroombyid)
roomrouter.route('/getnotif/:userId')
.get(getnotifcationtv)

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
roomrouter.post('/join-room-tv', addRoomInvitationtv);




export default  roomrouter;
