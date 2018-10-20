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
app.use('/third-party', express.static(__dirname + '/third-party'));

// Starts the server
server.listen(8080, function () {
    console.log('Starting server on port 8050');
});

const players = {};

// Add the WebSocket handlers
io.on('connection', function (socket) {

    console.log('Connected!');
    socket.on('login', function (event) {
        console.log('New player id: ' + event)
        players[socket.id] = {
            name: 'socket.id'
        };
    });

    socket.on('fire', function () {
        socket.broadcast.emit('fire');
        console.log('Player [' + socket.id + '] FIRE!')
    });

    socket.on('distance', function () {
        socket.broadcast.emit('distance');
        console.log('Player [' + socket.id + '] NEW DISTANCE!')
    });

    socket.on('speed up', function () {
        socket.broadcast.emit('speed up');
        console.log('Player [' + socket.id + '] SPEED UP!')
    });

    socket.on('speed down', function () {
        socket.broadcast.emit('speed down');
        console.log('Player [' + socket.id + '] SPEED DOWN!')
    });

});