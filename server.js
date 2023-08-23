const express = require('express');
const path = require('path');
const socket = require('socket.io');

const app = express();
app.use(express.static(path.join(__dirname, '/client')));

const messages = [];
const users = [];

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '/client/index.html'));
});

const server = app.listen(8000, () => {
  console.log('Server is running on port: 8000');
});
const io = socket(server);

io.on('connection', (socket) => {
  console.log('New client! Its id – ' + socket.id);

  socket.on('message', (message) => {
    console.log('Oh, I\'ve got something from ' + socket.id);
    messages.push(message);
    socket.broadcast.emit('message', message);
  });

  socket.on('join', (name) => {
    users.push({ name: name, id: socket.id });
    socket.broadcast.emit('join', name);
  });

  socket.on('disconnect', () => {
    console.log('Oh, socket ' + socket.id + ' has left');

    const user = users.find((user) => user.id === socket.id);
    const index = users.indexOf(user);
    if(index > -1) users.splice(index, 1);

    if(user) socket.broadcast.emit('left', user.name);
  });

  console.log('I\'ve added a listener on message event \n');
});
