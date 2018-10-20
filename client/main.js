$( document ).ready(function() {
    console.log( "ready!" );

    console.log(client);

    // client.pi();
});

var socket = io.connect('https://sealord-dshybeka.c9users.io');
var username = "";

var app = angular.module('seaLord', []);
app.controller('basicController', function($scope) {


   $scope.username;
   $scope.shiptype;

   $scope.fightStarted = false;

   $scope.socket= {};

   $scope.start = function() {
       console.log("START");

       username = $scope.username;

       $scope.fightStarted = true;
       
       var socket = io.connect('https://sealord-dshybeka.c9users.io');

       client.start();
       
       socket.emit('login', {'username': username});
       
        $( document ).ready(function() {
            var body = document.documentElement;
            if (body.requestFullscreen) {
              body.requestFullscreen();
            } else if (body.webkitrequestFullscreen) {
              body.webkitrequestFullscreen();
            } else if (body.mozrequestFullscreen) {
              body.mozrequestFullscreen();
            } else if (body.msrequestFullscreen) {
              body.msrequestFullscreen();
            }
            console.log(body);
        });
   };

   $scope.stop = function() {
       console.log("STOP");

       socket.close();
        client.stop();
       $scope.fightStarted = false;
       
       socket.emit('logout', {'username': username});
   };
   
   $scope.allowFight= function(){
       return $scope.username != null
       && $scope.username != ""
       && $scope.shiptype != null;
   };

    gyro.frequency = 500;
    gyro.startTracking(function (o) {
        
        $("#wheel").css('transform', 'rotate('+ o.y * 10 +'deg)');

        if (o.y < -1.5) {
            socket.emit('left', {'username': username, diff: Math.abs(o.y)});
            
        }

        if (o.y > 1.5) {
            socket.emit('right', {'username': username, diff: Math.abs(o.y)});
        }

        if (o.y < 1.5 & o.y > -1.5) {
            socket.emit('center', {'username': username, diff: 0});
        }

    });
});