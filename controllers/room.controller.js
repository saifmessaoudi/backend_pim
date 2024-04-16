import mongoose from "mongoose";
import Room from "../models/room.model.js";
import User from "../models/user.model.js";



  export async function addRoom(req, res) {
    try {
      // Extraire les données de la requête
      const { title, moviename, userowner, roomusers,roomusersPending,Allroomusers,roomPoster,UsersMicAccess,UsersChatAccess } = req.body;
  
      // Créer une nouvelle instance de Room
      const newRoom = new Room({
        title,
        moviename,
        userowner,
        roomusers,
        roomusersPending,
        Allroomusers ,
        roomPoster,
        UsersMicAccess,
        UsersChatAccess,

      });
  
      // Sauvegarder la nouvelle salle dans la base de données
      const savedRoom = await newRoom.save();
  
      res.status(201).json(savedRoom); // Répondre avec la salle ajoutée
    } catch (error) {
      console.error('Error adding room:', error);
      res.status(500).json({ message: 'Server error' });
    }
  };





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