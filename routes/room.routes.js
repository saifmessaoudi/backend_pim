import { Router } from "express";

import { addRoomInvitation, deleteRoomInvitation, getAllRooms, addaUserAccess, deleteUserAccess, addChatAccess, deleteChatAccess, addOwnerAccess, deleteOwnerAccess, deleteRoom, getnotifcationtv, addRoomInvitationtv, addRoom, getroombyid,adduserToRoom,acceptRoomInvitation,fetchRoomInvitationByUser,deleteuserfromRoom} from '../controllers/room.controller.js';


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

roomrouter.route('/acceptroominvitation')
.patch(acceptRoomInvitation)
roomrouter.route('/addUsertoRoom')
.patch(adduserToRoom)
roomrouter.route('/deleteuserfromroom')
.patch(deleteuserfromRoom)

roomrouter.route('/deleteroominvitation')
.patch(deleteRoomInvitation)


roomrouter.route('/getAllRooms')
.get(getAllRoomsWithPrivate)
roomrouter.route('/getRooms')
.get(getAllRooms)

roomrouter.route('/fetchRoomInvitation')
.get(fetchRoomInvitationByUser)

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

roomrouter.route('/deleteRoom')
.delete(deleteRoom) 
roomrouter.post('/join-room-tv', addRoomInvitationtv);





export default  roomrouter;
