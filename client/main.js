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
   
   $scope.socket;
   
   $scope.start = function() {
       console.log("START");
       console.log($scope.username);
       console.log($scope.shiptype);
       
       $scope.fightStarted = true;
       
       $scope.socket = io('http://localhost');
       $scope.socket.on('connect', function(){
       $scope.socket.on('event', function(data){});
       $scope.socket.on('disconnect', function(){});
   };
   
   $scope.allowFight= function(){
       return $scope.username != null
       && $scope.username != ""
       && $scope.shiptype != null;
   };
    
});