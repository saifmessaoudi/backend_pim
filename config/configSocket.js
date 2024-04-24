
const setupSocket = (io) =>{
    io.on('connection', (socket) => {
        console.log('connected');
      
        socket.on('joinRoom', (data) => {
            console.log("Received joinRoom event with data:", data); // Log the entire data object for debugging

            const  roomId  = data;
            if (socket.roomId && socket.roomId !== roomId) {
                // Only leave the room if the socket is in a different room
                socket.leave(socket.roomId);
                console.log(`A user left room: ${socket.roomId}`);
            }
            socket.join(roomId);
            socket.roomId = roomId;
            socket.broadcast.to(roomId).emit('joinRoom');
            console.log(`A user joined room: ${roomId}`);
        });
      
        socket.on('play', (data) => {
            console.log('play event received from user in room: ', socket.roomId);
            socket.broadcast.to(socket.roomId).emit('play');
        });
      
        socket.on('pause', (data) => {
            console.log('pause event received from user in room: ', socket.roomId);
            socket.broadcast.to(socket.roomId).emit('pause');
        });
      
        socket.on('seek', (data) => {
            const { seekTo } = data;
            socket.broadcast.to(socket.roomId).emit('seek', { seekTo });
        });
      
        socket.on('seek-backward', (data) => {
            const { seekTo } = data;
            socket.broadcast.to(socket.roomId).emit('seek-backward', { seekTo });
        });
      
        socket.on('stop', (data) => {
            socket.broadcast.to(socket.roomId).emit('stop');
        });
        socket.on('leaveRoom', (data) => {
            
          const { roomId, user } = data;
          console.log(data["user"])
          const userId = user.userId;
          socket.leave(roomId);
          socket.broadcast.to(roomId).emit('leaveRoom', { userId: userId });
          console.log(`User ${user.userId} left room: ${roomId}`);
      });
      
        socket.on('notification', (msg, callback) => {
          // Emit the chat message event
          io.emit('chat message', msg);
          socket.on('testEvent', (recipient, roomid) => {
              console.log('Received testEvent:', recipient, roomid);
          });
          
          io.emit('testNotification', {
              type: 'new_message',
              message: 'A new message has been added!',
              data: { content: msg }
          });
          
          if (typeof callback === 'function') {
              callback();
          }
      });
      
      
      // Disconnect event
      socket.on('disconnect', () => {
        if (socket.roomId) {
          socket.leave(socket.roomId); 
          console.log(`A user disconnected from room: ${socket.roomId}`);
      }
          console.log('A user disconnected');
      });
      });
      
      
     
};
export default setupSocket;

