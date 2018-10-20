nlu = (function() {
    
    console.log("Pika pi");
    
    var self = this;
    
    var instructions = $("#instr");

    function init() {
        
    }
    
    self.fire = function(text) {
        console.log("fire!");
    }
    
    self.distance = function(text) {
        console.log("distance!");
    }
    
    self.speedUp = function(text) {
        console.log("speed up!");
    }
    
    self.speedDown = function(text) {
        console.log("speed up!");
    }
    
    self.handle = function(text) {
        
        if (text == undefined) {
            return;
        }
        
        if (text === 'fire') {
            self.fire(text);
            return;
        }
        
        if (text === 'distance') {
            self.distance(text);
            return;
        }
        
        if (text === 'speed up') {
            self.speedUp(text);
            return;
        }
        
        if (text === 'speed down') {
            self.speedDown(text);
            return;
        }
    }
    
    function isFire(text) {
        return text === 'fire';
    }
    
    function isDistance(text) {
        return text.indexOf('distance') != -1;
    }
    
    function isSpeedUp(text) {
        return text === 'speed up';
    }
    
    function isSpeedDown(text) {
        return text === 'speed down';
    }
    
    init();
    
    return self;
}());