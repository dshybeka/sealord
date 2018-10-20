// Dependencies
const express = require('express');
const http = require('http');
const path = require('path');
const app = express();
const server = http.createServer(app);
const io = require('socket.io')(server);

app.set('port', 8050);
app.use('/public', express.static(__dirname + '/public'));
app.use('/shared', express.static(__dirname + '/shared'));

// Routing
app.get('/', function(request, response) {
    response.sendFile(path.join(__dirname, 'index.html'));
});

// Starts the server
server.listen(8050, function() {
    console.log('Starting server on port 8050');
});

const players = {};

// Add the WebSocket handlers
io.on('connection', function (socket) {
    console.log('Connected!');
    socket.on('new player', function () {
        players[socket.id] = {
            name: 'Capitan'
        };
    });

});