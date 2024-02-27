import twilio from 'twilio';

const accountSid = "AC47cb7a314a62d6f9cd0a028b2eb0cb24";
const authToken = "78f7b00240f25d64784845388c7128e0";
const client = twilio(accountSid, authToken);


export const sendSMS = async (req, res) => {
    try {
        const message = await client.messages.create({
            from: '+16502295914', // Remplacez par votre numéro Twilio
            body: 'Hi there! This is a test message from your Node.js application.',
            to: '+21629886500' // Remplacez par le numéro de téléphone destinataire
        });
        console.log(message.sid);
        res.status(200).json({ message: "Message sent successfully", messageId: message.sid });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Failed to send message", error: error.message });
    }
};