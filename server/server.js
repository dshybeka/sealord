
// Dependencies
const express = require('express');
const http = require('http');
const path = require('path');
const socketIO = require('socket.io');
const app = express();
const server = http.createServer(app);
const io = require('socket.io')(server);

app.set('port', 8050);
app.use(express.static('public'));

// Routing
app.get('/', function(request, response) {
    response.sendFile(path.join(__dirname, 'index.html'));
});

// Starts the server
server.listen(8050, function() {
    console.log('Starting server on port 8050');
});

// Add the WebSocket handlers
io.on('connection', function(socket) {
});