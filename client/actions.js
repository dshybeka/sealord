client = (function() {
    
    console.log("Pika pi");
    
    var self = this;
    
    var instructions = $("#instr");
    
    // function init() {
        
    //     try {
    //     //   var SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    //     //   var SpeechRecognition = SpeechRecognition.SpeechRecognition()
    //       var recognition = SpeechRecognition.SpeechRecognition();
          
    //       console.log("recognition " + recognition);
    //       initSpeech(recognition);
    //     }
    //     catch(e) {
    //       console.error(e);
    //     //   $('.no-browser-support').show();
    //     //   $('.app').hide();
    //     }
    // }
    function init() {
        
        var SpeechRecognition = SpeechRecognition || webkitSpeechRecognition
        var SpeechGrammarList = SpeechGrammarList || webkitSpeechGrammarList
        var SpeechRecognitionEvent = SpeechRecognitionEvent || webkitSpeechRecognitionEvent
        
        var recognition = new SpeechRecognition();
        var speechRecognitionList = new SpeechGrammarList();
        // recognition.continuous = true;
        recognition.lang = 'en-US';
        recognition.interimResults = false;
        recognition.maxAlternatives = 1;
        
        initSpeech(recognition);
    }
    
    
    function initSpeech(recognition) {

        recognition.onstart = function() { 
          instructions.text('On start.');
        }
        
        recognition.onspeechend = function() {
          instructions.text('ON end.');
        }
        
        recognition.onerror = function(event) {
          if(event.error == 'no-speech') {
            instructions.text('Speech error');
          };
        }
        
        recognition.onspeechstart  = function(event) {
            console.log("Started speechk");
            instructions.text('Started!');  
        }
        
        recognition.onresult = function(event) {
        
          var current = event.resultIndex;
        
          var transcript = event.results[current][0].transcript;
          
          var mobileRepeatBug = (current == 1 && transcript == event.results[0][0].transcript);
            
          var noteContent = "";
          if(!mobileRepeatBug) {
            noteContent = transcript;
          }
        
          console.log("text " + noteContent);
        }
        
        recognition.onend = function() {
            recognition.start();
        };
        
        $('#start-record-btn').on('click', function(e) {
          recognition.start();
        });
        $('#stop-record-btn').on('click', function(e) {
          recognition.stop();
        });
    }
    
    self.pi = function() {
        console.log("Pi!");
        instructions.text("ho-ho-ho");
    }
    
    init();
    
    return self;
}());