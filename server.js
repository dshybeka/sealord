// Dependencies
const express = require('express');
const http = require('http');
const path = require('path');
const app = express();
const server = http.createServer().listen(process.env.PORT, process.env.IP);
const io = require('socket.io');

//app.set('port', 8050);
app.use('/public', express.static(__dirname + '/public'));
app.use('/shared', express.static(__dirname + '/shared'));

// Routing
app.get('/', function (request, response) {
    response.sendFile(path.join(__dirname, 'index.html'));
});

app.get('/login', function (request, response) {
    response.sendFile(path.join(__dirname, 'client/index.html'));
});

var socket = io.listen(server);

// Starts the server
// server.listen(8050, function () {
//     console.log('Starting server on port 8050');
// });

const players = {};

// Add the WebSocket handlers
socket.sockets.on('connection', function (socket) {

    console.log('Connected!');
    socket.on('new player', function () {
        console.log('New player id: ' + socket.id)
        players[socket.id] = {
            name: 'socket.id'
        };
    });

    socket.on('fire', function () {
        console.log('Player [' + socket.id + '] FIRE!')
    });

    socket.on('distance', function () {
        console.log('Player [' + socket.id + '] NEW DISTANCE!')
    });

    socket.on('speed up', function () {
        console.log('Player [' + socket.id + '] SPEED UP!')
    });

    socket.on('speed down', function () {
        console.log('Player [' + socket.id + '] SPEED DOWN!')
    });

});