// client.js
import ioo from 'socket.io-client';

const socket = ioo("https://backend-pim.onrender.com/");

socket.on('connect', () => {
    console.log('Connected to server');

    // Now, listen for 'testNotification'
    socket.on('connection', (data) => {
        console.log('Received testNotification:', data);
    });
    socket.on('testNotification', (data) => {
        console.log('Received testNotification:', data);
    });
});
// Add more event listeners or emit events as needed
