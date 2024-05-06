import ioo from 'socket.io-client';

const socket = ioo("https://backend-pim.onrender.com");

socket.on('connect', () => {
    console.log('Connected to server');

    
    socket.on('testNotification', (data) => {
        console.log('Received testNotification:', data);
    });
});

