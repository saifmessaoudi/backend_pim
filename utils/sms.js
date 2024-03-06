import twilio from 'twilio';
import dotenv from 'dotenv';

dotenv.config();

async function sendSMS(message, to) {
    try {
        const client = new twilio(process.env.ACCOUNT_SID, process.env.AUTH_TOKEN);
        const messageInfo = await client.messages.create({
            body: message,
            from: process.env.FROM,
            to,
        });
        return messageInfo;
    } catch (error) {
        console.error('Twilio error:', error.message);
        throw new Error('Failed to send SMS. Check Twilio configuration.');
    }
}

(async () => {
    try {
        const messageInfo = await sendSMS('Hi there, we will check your reclamation', '+21656831817');
        console.log(messageInfo);
    } catch (error) {
        console.error('Error:', error.message);
    }
})();
export { sendSMS };