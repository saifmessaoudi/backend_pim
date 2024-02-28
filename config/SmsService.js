import twilio from 'twilio';

const accountSid = "AC47cb7a314a62d6f9cd0a028b2eb0cb24";
const authToken = "78f7b00240f25d64784845388c7128e0";
const client = twilio(accountSid, authToken);


export const sendSMS = async (messageBody) => {
    try {
        const message = await client.messages.create({
            from: '+16502295914', // Replace with your Twilio number
            body: messageBody, // Use the provided message body
            to: '+21629886500' // Replace with the recipient's phone number
        });
        console.log(message.sid);
        return { message: "Message sent successfully", messageId: message.sid };
    } catch (error) {
        console.error(error);
        throw new Error("Failed to send message: " + error.message);
    }
};
