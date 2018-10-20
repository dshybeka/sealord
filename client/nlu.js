nlu = (function() {

    console.log("Pika pi");
    const speedUpDictionary = ['speed up!', 'pick up', 'pick up!', 'speed up', 'beat up', 'beat up!', 'beats up', 'beats up!', 'spit up', 'spit up!', 'up', 'up!', 'speak up', 'speak up!', 'Meetup', 'Meetup!', 'meet up', 'meet up!', 'meetup', 'meetup!', 'sit up', 'sit up!', 'seek up', 'seek up!', 'get up', 'get up!'];

    const speedDownDictionary = ['speed down', 'speed down!', 'seat down', 'seat down!', 'seek down', 'seek down!', 'down', 'down!', 'deep down', 'deep down!', 'skip doll', 'skip doll!', 'Dome', 'Dome!', 'speed doll', 'speed doll!', 'seat doll', 'seat doll!', 'deep doll', 'skip down', 'it down', 'get down', 'people down', 'Dawn', 'deep doll!', 'skip down!', 'it down!', 'get down!', 'people down!', 'Dawn!'];

    const fireDictionary = ['fire', 'fire!', 'quiet', 'quiet!', 'by year', 'white', 'by year!', 'white!'];

    var self = this;

    var instructions = $("#instr");

    function init() {

    }

    self.fire = function(text) {
        console.log("fire!");
        socket.emit('fire',  {'username' : username });
    }

    self.distance = function(text) {
        console.log("distance!");
        socket.emit('distance', {'username' : username });
    }

    self.speedUp = function(text) {
        console.log("speed up!");
        socket.emit('speed up',  {'username' : username });
    }

    self.speedDown = function(text) {
        console.log("speed up!");
        socket.emit('speed down',  {'username' : username });
    }

    self.handle = function(text) {
        if (text === undefined) {
            return;
        }

        console.log(text);

        if (fireDictionary.includes(text)) {
            self.fire(text);
            return;
        }

        if (text === 'distance') {
            self.distance(text);
            return;
        }

        if (speedUpDictionary.includes(text)) {
            self.speedUp(text);
            return;
        }

        if (speedDownDictionary.includes(text)) {
            self.speedDown(text);
            return;
        }
    }

    function isFire(text) {
        return text === 'fire';
    }

    function isDistance(text) {
        return text.indexOf('distance') !== -1;
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