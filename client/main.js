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
    gyro.startTracking(function (o) {

        if (o.y < 0) {
            socket.emit('left', {'username': username, diff: Math.abs(o.y)});
            console.log("New left: " + Math.abs(o.y));
            $("#left").text("Left" + Math.abs(o.y));
        }

        if (o.y > 0) {
            socket.emit('right', {'username': username, diff: Math.abs(o.y)});
            console.log("New left: " + Math.abs(o.y));
            $("#right").text("Right" + Math.abs(o.y));
        }

    });
});