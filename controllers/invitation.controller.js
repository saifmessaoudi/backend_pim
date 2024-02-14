import Invitation from '../models/invitation.model.js';
import User from '../models/user.model.js';



export async function addInvitation(req, res) {
    try {
      
      const { sender, recipient,status } = req.body;
  
       // Check if sender and recipient exist as users
       const senderExists = await User.exists({ _id: sender });
       const recipientExists = await User.exists({ _id: recipient });

       // If sender or recipient does not exist, return a 404 Not Found response
       if (!senderExists || !recipientExists) {
           return res.status(404).json({ message: 'Sender or recipient does not exist' });
       }
     
      const newInvitation = new Invitation({
        sender,
        recipient,
        status
      });
  
      await newInvitation.save();
  
      res.status(201).json({ message: 'invitation created successfully', invitation: newInvitation });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Internal server error' });
    }
  }
  export async function removeInvitation(req, res) {
    try {
        const { sender, recipient } = req.body;

        // Find the invitation with the specified sender and recipient
        const invitation = await Invitation.findOne({ sender, recipient });

        // If no invitation is found, return a 404 Not Found response
        if (!invitation) {
            return res.status(404).json({ message: 'Invitation not found' });
        }

        // Remove the invitation from the database
        await invitation.deleteOne();

        res.status(200).json({ message: 'Invitation removed successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
}



  
