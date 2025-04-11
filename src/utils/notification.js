export const sendNotification = (userId, notificationData, io, connectedUsers) => {
    const socketId = connectedUsers.get(userId.toString());
    
    if (socketId) {
        io.to(socketId).emit("notification", notificationData);
    }
};
