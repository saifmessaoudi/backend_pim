import User from '../models/user.model.js';

export async function getAll(req, res) {
    User
    .find({})
    .then(docs => {
        res.status(200).json(docs);
    })
    .catch(err => {
        res.status(500).json({ error: err });
    });
}

export async function addInvitation(req, res) {
    try {
        const { sender, recipient } = req.body;

 

        const senderExists = await User.exists({ _id: sender });
        const recipientExists = await User.exists({ _id: recipient });

        if (!senderExists || !recipientExists) {
            return res.status(404).json({ message: 'Sender or recipient does not exist' });
        }
            const Usersender = await User.findOne({ _id: sender }); 
            const Userrecipient = await User.findOne({ _id: recipient });
 
        

           const senderverif = Usersender.friendRequestsSent.includes(recipient);
           const recipientverif = Userrecipient.friendRequests.includes(sender);
     
            

        if ( senderverif || recipientverif) {
            return res.status(404).json({ message: 'the invitation is already added' });
        }


        
       

       
        await User.findByIdAndUpdate(sender, { $push: { friendRequestsSent: recipient } });

       
        await User.findByIdAndUpdate(recipient, { $push: { friendRequests: sender } });

        res.status(201).json({ message: 'Invitation created successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
}

export async function deleteInvitation(req,res){
    try{
        const { sender, recipient } = req.body;
        const senderExists = await User.exists({ _id: sender });
        const recipientExists = await User.exists({ _id: recipient });

        if (!senderExists || !recipientExists) {
            return res.status(404).json({ message: 'Sender or recipient does not exist' });
        }
            const Usersender = await User.findOne({ _id: sender }); 
            const Userrecipient = await User.findOne({ _id: recipient });


            const senderverif = Usersender.friendRequestsSent.includes(recipient);
            const recipientverif = Userrecipient.friendRequests.includes(sender);
      
             
 
         if ( !senderverif || !recipientverif) {
             return res.status(404).json({ message: 'the invitation is not already added' });
         }
         await User.findByIdAndUpdate(sender, { $pull: { friendRequestsSent: recipient } });

       
         await User.findByIdAndUpdate(recipient, { $pull: { friendRequests: sender } });
 
         res.status(201).json({ message: 'Invitation is removed successfully' });



    } catch(error){
        console.error(error) ; 
        res.status(500).json({message : "Internal server error"}) ; 
    }

}


