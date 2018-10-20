// Dependencies
const express = require('express');
const http = require('http');
const path = require('path');
const app = express();
const server = http.createServer(app);
const io = require('socket.io')(server);

//app.set('port', 8080);
app.get('/server', function (request, response) {
    response.sendFile(path.join(__dirname, 'server/index.html'));
});

app.get('/', function (request, response) {
    response.sendFile(path.join(__dirname, 'client/index.html'));
});

app.use('/client', express.static(__dirname + '/client'));
app.use('/server', express.static(__dirname + '/server'));

// Starts the server
server.listen(8080, function () {
    console.log('Starting server on port 8050');
});

const players = {};

// Add the WebSocket handlers
io.on('connection', function (socket) {

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