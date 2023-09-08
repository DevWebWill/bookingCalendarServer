import  { Server } from 'socket.io';
import corsOptions from './config/cors.js';

const socket = (httpServer) => {
    const io = new Server(httpServer, {
        cors: corsOptions,
        maxHttpBufferSize: 1e8
    });

    io.on('connection', (socket) => {
        socket.on("update-data", ({}, callback) => {
            io.emit('refresh-data');
            callback();
        });

        socket.on("delete-data", ({idt}, callback) => {
            io.emit('refresh-after-delete-data', { idt: idt });
            callback();
        });

        socket.on("stream", ({image}, callback) => {
            io.emit('receptor', { image: image });
            callback();
        });
    });

    io.on("disconnect", () => {
        console.log('Usuario desconectado');
        state.connected = false;
    });
}

export default socket;