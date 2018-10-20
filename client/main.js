$( document ).ready(function() {
    console.log( "ready!" );

    console.log(client);

    // client.pi();
});

var socket = {};
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

       socket = io.connect('https://sealord-dshybeka.c9users.io');

       console.log(client);

       client.start();
       
       socket.emit('login', {'username': username});
   };

   $scope.stop = function() {
       console.log("STOP");

       socket.close();
        client.stop();
       $scope.fightStarted = false;
   };
   
   $scope.allowFight= function(){
       return $scope.username != null
       && $scope.username != ""
       && $scope.shiptype != null;
   };

    gyro.frequency = 5;
    let currentLeft = 0;
    let currentRight = 0;

    gyro.startTracking(function (o) {

        const newLeft = o.x;
        const newRight = o.y;

        if (currentLeft !== newLeft) {
            socket.emit('left',  {'username' : username, diff: Math.abs(newLeft - currentLeft)});
            console.log("New left: " + newLeft)
            $("#left").text(newLeft);
        }

        if (currentRight !== newRight) {
            socket.emit('right',  {'username' : username, diff: Math.abs(newRight - currentRight)});
            console.log("New right: " + newRight)
            $("#right").text(newRight);
        }

    });
});