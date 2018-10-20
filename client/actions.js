$( document ).ready(function() {
    
    client = (function() {
        
        console.log("Pika pi");
        
        var self = this;
        
        self.pi2 = function() {
            console.log("Pi!");
        }
        
        return self;
    });
    
    client.pi2();
});