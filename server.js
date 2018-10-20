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
app.use('/server/', express.static(__dirname + '/server'));
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
        socket.broadcast.emit('login', event);
        console.log('New player id: ' + event)
        players[socket.id] = {
            name: 'socket.id'
        };
    });

    socket.on('fire', function (event) {
        socket.broadcast.emit('fire', event);
        console.log('Player [' + socket.id + '] FIRE!')
    });

    socket.on('distance', function (event) {
        socket.broadcast.emit('distance', event);
        console.log('Player [' + socket.id + '] NEW DISTANCE!')
    });

    socket.on('speed up', function (event) {
        socket.broadcast.emit('speed up', event);
        console.log('Player [' + socket.id + '] SPEED UP!')
    });

    socket.on('speed down', function (event) {
        socket.broadcast.emit('speed down', event);
        console.log('Player [' + socket.id + '] SPEED DOWN!')
    });

    socket.on('left', function (event) {
        socket.broadcast.emit('left', event);
        console.log('Player [' + socket.id + '] LEFT COMMAND!')
    });

    socket.on('right', function (event) {
        socket.broadcast.emit('right', event);
        console.log('Player [' + socket.id + '] RIGHT COMMAND!')
    });

});