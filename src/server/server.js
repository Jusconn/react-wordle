const express = require('express');
const { createServer } = require('http');
const { Server } = require('socket.io');
const next = require('next');

const dev = process.env.NODE_ENV !== 'production';
const nextApp = next({ dev });
const handle = nextApp.getRequestHandler();

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer);

const PORT = process.env.PORT || 3000;

const activeSockets = {};

const rooms = {};

nextApp.prepare().then(() => {
  // Socket.IO event handlers
  io.on('connection', (socket) => {
    console.log('User Connected', socket.id);

    activeSockets[socket.id] = {
      rooms: [],
    };

    socket.on('createRoom', (roomData) => {
      const [roomCode, userName, secretWord, id] = roomData;
      rooms[roomCode] = {
        socketIds: [],
        roomCode: roomCode,
        users: [userName],
        secretWords: [secretWord],
      };
      activeSockets[socket.id].rooms.push(roomCode);
      console.log(userName, 'created room', roomCode);
      socket.emit('roomCreated', roomCode, userName);
    });

    socket.on('joinRoom', (roomData) => {
      const [roomCode, userName, secretWord, id] = roomData;
      if (rooms[roomCode]) {
        rooms[roomCode].users.push(userName);
        rooms[roomCode].secretWords.push(secretWord);
        console.log(userName, 'joined room', roomCode);
        socket.emit('roomJoined', roomCode, userName);
      } else {
        socket.emit('roomError', 'Room Not Found');
      }
    });

    socket.on('checkRoom', (roomCode) => {
      console.log('checking room', roomCode);
      socket.join(roomCode);
      if (rooms[roomCode] && rooms[roomCode].users.length === 2) {
        console.log('2 players in room', roomCode);
        io.to(roomCode).emit('2players');
      } else {
        console.log('Room not found or not enough players', roomCode);
      }
    });

    socket.on('getPlayerData', (roomCode) => {
      console.log('getting player data for room', roomCode);
      if (rooms[roomCode]) {
        const users = rooms[roomCode].users;
        console.log('Room found', rooms[roomCode].users);
        const secretWords = rooms[roomCode].secretWords;
        console.log('sending player data', users, secretWords);
        io.to(roomCode).emit('playerData', users, secretWords);
      } else {
        console.log('Room not found', roomCode);
        socket.emit('roomNotFound');
      }
    });

    socket.on('guess', (guess, roomCode) => {
      console.log('guessing', guess, 'in room', roomCode);
      socket.to(roomCode).emit('opponentGuess', guess);
    });

    socket.on('againSelection', (roomCode, choice, oppWord) => {
      socket.to(roomCode).emit('opponentAgainSelection', choice, oppWord);
    });

    socket.on('playAgain', (roomCode) => {
      console.log('playing again in room', roomCode);
      rooms[roomCode].secretWords = [];
      io.to(roomCode).emit('playAgain');
    });

    socket.on('disconnect', () => {
      console.log('User Disconnected', socket.id);
      activeSockets[socket.id].rooms.forEach((room) => {
        socket.leave(room);
        rooms[room].users = rooms[room].users.filter((user) => user !== socket.id);
        if (rooms[room].users.length === 0) {
          delete rooms[room];
        }
      });
    });
  });

  // Serve static files
  app.use(express.static('public'));

  // Default Next.js handler
  app.all('*', (req, res) => {
    return handle(req, res);
  });

  httpServer.listen(PORT,'0.0.0.0', (err) => {
    if (err) throw err;
    console.log(`server listening on port ${PORT}`);
  });
});