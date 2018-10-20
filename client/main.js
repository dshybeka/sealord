$( document ).ready(function() {
    console.log( "ready!" );
    
    console.log(client);
    
    // client.pi();
});

var socket = {};

var app = angular.module('seaLord', []);
app.controller('basicController', function($scope) {
   
   
   $scope.username;
   $scope.shiptype;
   
   $scope.fightStarted = false;
   
   $scope.socket= {};
   
   $scope.start = function() {
       console.log("START");
       console.log($scope.username);
       console.log($scope.shiptype);
       
       $scope.fightStarted = true;
       
       socket = io.connect('https://sealord-dshybeka.c9users.io');
       
       console.log(client);
       
       client.pi();

       
   };
   
   $scope.stop = function() {
       console.log("STOP");
       
       socket.close();
       $scope.fightStarted = false;
   };
   
   $scope.allowFight= function(){
       return $scope.username != null
       && $scope.username != ""
       && $scope.shiptype != null;
   };
    
});