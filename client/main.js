$( document ).ready(function() {
    console.log( "ready!" );
    
    console.log(client);
    
    client.pi();
});

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
       
       $scope.socket = io('https://sealord-dshybeka.c9users.io/server');
       
       console.log($scope.socket);
       
       
       $scope.socket.on('connect', function(){
           console.log("CONNECTED");
       });
       $scope.socket.on('event', function(data){
           console.log("DATA" + data);
       });
       $scope.socket.on('disconnect', function(){});
       
       $scope.socket.emit("my other event", { message : "client emit" } );
   };
   
   $scope.stop = function() {
       console.log("STOP");
       
       $scope.socket.close();
       $scope.fightStarted = false;
   };
   
   $scope.allowFight= function(){
       return $scope.username != null
       && $scope.username != ""
       && $scope.shiptype != null;
   };
    
});