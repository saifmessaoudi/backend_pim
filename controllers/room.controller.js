import mongoose from "mongoose";
import Room from "../models/room.model.js";
import User from "../models/user.model.js";
import Notification from "../models/notificationtv.model.js";
import { io } from '../server.js';
;

export async function addRoom(req, res) {
  try {
      // Extraire les données de la requête
      const { title, moviename, userowner, roomusers, roomusersPending, Allroomusers, roomPoster, UsersMicAccess, UsersChatAccess,UsersOwnerAccess } = req.body;

      // Créer une nouvelle instance de Room
      const newRoom = new Room({
          title,
          moviename,
          userowner,
          roomusers: [userowner], 
          roomusersPending,
          Allroomusers,
          roomPoster,
          UsersMicAccess,
          UsersChatAccess,
          UsersOwnerAccess: [userowner] 
      });

      // Sauvegarder la nouvelle salle dans la base de données
      const savedRoom = await newRoom.save();

      res.status(201).json(savedRoom); // Répondre avec la salle ajoutée
  } catch (error) {
      console.error('Error adding room:', error);
      res.status(500).json({ message: 'Server error' });
  }
};



  export async function deleteRoom(req, res) {
    try {
      
        const { roomId } = req.body;
        
       
        if (!roomId) {
            return res.status(400).json({ message: 'Room ID is required' });
        }
        const room = await Room.findById({ _id: roomId });
       
        const deletedRoom = await Room.findByIdAndDelete(roomId);

        if (!deletedRoom) {
            return res.status(404).json({ message: 'Room not found' });
        }

        res.status(201).json(room); 
      } catch (error) {
        console.error('Error deleting room:', error);
        res.status(500).json({ message: 'Server error' });
    }
}


  export async function addRoomInvitation(req, res) {
    try {
      const { roomid, recipient } = req.body;
  
      const roomExists = await Room.exists({ _id: roomid });
      const recipientExists = await User.exists({ _id: recipient });
  
      if (!roomExists || !recipientExists) {
        return res.status(404).json({ message: 'room or recipient does not exist' });
      }
  
      const Roomsender = await Room.findOne({ _id: roomid }); 
  
      const roomverif = Roomsender.roomusersPending.includes(recipient);
     
      if (roomverif ) {
        return res.status(404).json({ message: 'The invitation is already added' });
      }
  
      // Update database with friend requests
      await Room.findByIdAndUpdate(roomid, { $push: { roomusersPending: recipient } });
  
      // Notify recipient about the new invitation

      io.emit('newRoomRequest', { roomid, recipient })
      
  
      res.status(201).json({ message: 'Invitation created successfully' });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Internal server error' });
    }
  }

  export async function acceptRoomInvitation(req, res) {
    try {
      const { roomid, recipient } = req.body;
  
      const roomExists = await Room.exists({ _id: roomid });
      const recipientExists = await User.exists({ _id: recipient });
  
      if (!roomExists || !recipientExists) {
        return res.status(404).json({ message: 'room or recipient does not exist' });
      }
  
      const Roomsender = await Room.findOne({ _id: roomid }); 
  
      const roomverif = Roomsender.roomusers.includes(recipient);
     
      if (roomverif ) {
        return res.status(404).json({ message: 'the user already added to the room' });
      }
  
      // Update database with friend requests
      await Room.findByIdAndUpdate(roomid, {
        $push: { roomusers: recipient },
        $pull: { roomusersPending: recipient, Allroomusers: recipient }
    });
  
      // Notify recipient about the new invitation
      
  
      res.status(201).json({ message: 'Room Invitation accepted successfully' });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Internal server error' });
    }
  }


  
  export async function adduserToRoom(req, res) {
    try {
      const { roomid, recipient } = req.body;
  
      const roomExists = await Room.exists({ _id: roomid });
      const recipientExists = await User.exists({ _id: recipient });
  
      if (!roomExists || !recipientExists) {
        return res.status(404).json({ message: 'room or recipient does not exist' });
      }
  
      const Roomsender = await Room.findOne({ _id: roomid }); 
  
      const roomverif = Roomsender.roomusersPending.includes(recipient);
     
      if (roomverif ) {
        return res.status(404).json({ message: 'The invitation is already added' });
      }
  
      // Update database with friend requests
      await Room.findByIdAndUpdate(roomid, { $push: { roomusers: recipient } });
  
      // Notify recipient about the new invitation
      
  
      res.status(201).json({ message: 'Invitation created successfully' });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Internal server error' });
    }
  }



  export async function deleteRoomInvitation(req, res) {
    try {
      const { roomid, recipient } = req.body;
  
      const roomExists = await Room.exists({ _id: roomid });
      const recipientExists = await User.exists({ _id: recipient });
  
      if (!roomExists || !recipientExists) {
        return res.status(404).json({ message: 'room or recipient does not exist' });
      }
  
      const Roomsender = await Room.findOne({ _id: roomid }); 
  
      const roomverif = Roomsender.roomusersPending.includes(recipient);
     
      if (!roomverif ) {
        return res.status(404).json({ message: 'The invitation is not already added' });
      }
  
      // Update database with friend requests
      await Room.findByIdAndUpdate(roomid, { $pull: { roomusersPending: recipient } });
  
      // Notify recipient about the new invitation
      
  
      res.status(201).json({ message: 'Invitation deleted successfully' });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Internal server error' });
    }
  }



  
  export async function getAllRooms(req, res) {
    Room.find({})
        .populate({
            path: 'messages',
            populate: {
                path: 'user',
                model: 'User'
            }
        })
        .then(docs => {
            res.status(200).json(docs);
        })
        .catch(err => {
            res.status(500).json({ error: err });
        });
}



  
export async function addaUserAccess(req, res) {
  try {
    const { Roomid, Userid } = req.body;

    const userExists = await User.exists({ _id: Userid });
    const roomExists = await Room.exists({ _id: Roomid });

    if (!userExists || !roomExists) {
      return res.status(404).json({ message: 'User or room does not exist' });
    }

    const room = await Room.findOne({ _id: Roomid }); 
    const userHasAccess = room.UsersMicAccess.includes(Userid);
   
    if (userHasAccess) {
      return res.status(400).json({ message: 'The user already has access' });
    }

    await Room.findByIdAndUpdate(Roomid, { $push: { UsersMicAccess: Userid } });

    res.status(201).json({ message: 'Access granted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
}

export async function deleteUserAccess(req, res) {
  try {
    const { Roomid, Userid } = req.body;

    const userExists = await User.exists({ _id: Userid });
    const roomExists = await Room.exists({ _id: Roomid });

    if (!userExists || !roomExists) {
      return res.status(404).json({ message: 'User or room does not exist' });
    }

    const room = await Room.findOne({ _id: Roomid }); 
    const userHasAccess = room.UsersMicAccess.includes(Userid);
   
    if (!userHasAccess) {
      return res.status(400).json({ message: 'The user does not have access' });
    }

    await Room.findByIdAndUpdate(Roomid, { $pull: { UsersMicAccess: Userid } });

    res.status(200).json({ message: 'Access deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
}


export async function addChatAccess(req, res) {
  try {
    const { Roomid, Userid } = req.body;

    const userExists = await User.exists({ _id: Userid });
    const roomExists = await Room.exists({ _id: Roomid });

    if (!userExists || !roomExists) {
      return res.status(404).json({ message: 'User or room does not exist' });
    }

    const room = await Room.findOne({ _id: Roomid }); 
    const userHasAccess = room.UsersChatAccess.includes(Userid);
   
    if (userHasAccess) {
      return res.status(400).json({ message: 'The user already has access' });
    }

    await Room.findByIdAndUpdate(Roomid, { $push: { UsersChatAccess: Userid } });

    res.status(201).json({ message: 'Access granted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
}

export async function deleteChatAccess(req, res) {
  try {
    const { Roomid, Userid } = req.body;

    const userExists = await User.exists({ _id: Userid });
    const roomExists = await Room.exists({ _id: Roomid });

    if (!userExists || !roomExists) {
      return res.status(404).json({ message: 'User or room does not exist' });
    }

    const room = await Room.findOne({ _id: Roomid }); 
    const userHasAccess = room.UsersChatAccess.includes(Userid);
   
    if (!userHasAccess) {
      return res.status(400).json({ message: 'The user does not have access' });
    }
    await Room.findByIdAndUpdate(Roomid, { $pull: { UsersChatAccess: Userid } });

    // Répondre avec succès
    res.status(200).json({ message: 'Access deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
}

export async function addOwnerAccess(req, res) {
  try {
    const { Roomid, Userid } = req.body;

    const userExists = await User.exists({ _id: Userid });
    const roomExists = await Room.exists({ _id: Roomid });

    if (!userExists || !roomExists) {
      return res.status(404).json({ message: 'User or room does not exist' });
    }

    const room = await Room.findOne({ _id: Roomid }); 
    const userHasAccess = room.UsersOwnerAccess.includes(Userid);
   
    if (userHasAccess) {
      return res.status(400).json({ message: 'The user already has access' });
    }

    await Room.findByIdAndUpdate(Roomid, { $push: { UsersOwnerAccess: Userid } });

    res.status(201).json({ message: 'Access granted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
}
export async function deleteOwnerAccess(req, res) {
  try {
    const { Roomid, Userid } = req.body;

    const userExists = await User.exists({ _id: Userid });
    const roomExists = await Room.exists({ _id: Roomid });

    if (!userExists || !roomExists) {
      return res.status(404).json({ message: 'User or room does not exist' });
    }

    const room = await Room.findOne({ _id: Roomid }); 
    const userHasAccess = room.UsersOwnerAccess.includes(Userid);
   
    if (!userHasAccess) {
      return res.status(400).json({ message: 'The user does not have access' });
    }
    await Room.findByIdAndUpdate(Roomid, { $pull: { UsersOwnerAccess: Userid } });

    // Répondre avec succès
    res.status(200).json({ message: 'Access deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
}
export const getroombyid = async (req, res) => {
  const { roomId } = req.params;
  try {
    const room = await Room.findById(roomId);
    if (!room) {
      return res.status(404).json({ message: "Room not found" });
    }
    res.status(200).json(room);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const sendjoinroomfortv = async (req, res) => {
  try {
    const { roomId, userId } = req.body; // Supposons que vous recevez l'ID de la salle et l'ID de l'utilisateur dans le corps de la requête

    // Vérifier si la salle et l'utilisateur existent
    const roomExists = await Room.exists({ _id: roomId });
    const userExists = await User.exists({ _id: userId });

    if (!roomExists || !userExists) {
      return res.status(404).json({ message: 'Room or user does not exist' });
    }

    // Ajouter l'utilisateur à la salle avec la télévision
    await Room.findByIdAndUpdate(roomId, { $push: { roomusers: userId } });

    res.status(200).json({ message: 'User successfully joined room with TV' });
  } catch (error) {
    console.error('Error joining room with TV:', error);
    res.status(500).json({ message: 'Server error' });
  }
};
export async function addRoomInvitationtv(req, res) {
  try {
    const { roomid, recipient } = req.body;

    // Vérification de l'existence de la salle et du destinataire
    const roomExists = await Room.exists({ _id: roomid });
    const recipientExists = await User.exists({ _id: recipient });

    if (!roomExists || !recipientExists) {
      return res.status(404).json({ message: 'Room or recipient does not exist' });
    }

    const roomsender = await Room.findOne({ _id: roomid }); 

    // Delete existing notification for the same recipient and room
    await Notification.findOneAndDelete({ recipient: recipient });

    // Ajout de la nouvelle invitation dans la salle
    await Room.findByIdAndUpdate(roomid, { $push: { roomusersPending: recipient } });

    // Création de la notification pour le destinataire
    const newNotification = new Notification({
      recipient: recipient,
      sender: roomsender.userowner,
      message: `You Can Join to Room Name "${roomsender.title}"`,
      roomId: roomid
    });
    await newNotification.save();
    res.status(201).json({ message: 'Invitation created successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
}



// Import your socket.io instance

export const getnotifcationtv = async (req, res) => {

  const { userId } = req.params;
  try {
      const notifications = await Notification.find({ recipient: userId }).populate('sender');
      
      // Si aucune notification n'est disponible immédiatement, attendez jusqu'à ce qu'une nouvelle notification soit ajoutée à la base de données
      if (notifications.length === 0) {
          await new Promise(resolve => {
              Notification.watch().on('change', async change => {
                  if (change.operationType === 'insert') {
                      const newNotification = await Notification.findById(change.documentKey._id).populate('sender');
                      res.json([newNotification]);
                      resolve();
                  }
              });
          });
      } else {
          res.json(notifications);
      }
  } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Internal server error' });
  }
};

