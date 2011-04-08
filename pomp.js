(function($) {

    var receiveMessage = function(e) {
      var data = $(document.body).data('pomp');

      // Will raise error if response is invalid JSON
      var j = JSON.parse(e.data);
      // Would it be better to not throw here so random bogus messages can't break things?
      if (! j.hasOwnProperty("messageId")) {
        throw "no Messsage ID in " + e.data;
      }
      var messageId = j['messageId'];
      if (! data.receivers.hasOwnProperty(messageId)) {
        throw "No callback for message " + messageId;
      }
      var payload = j['payload'] || "";
      // Invoke the callback
      data.receivers[messageId].call(data.receivers[messageId], payload);
      // And then remove the callback from the receivers hash
      delete(data.receivers[messageId]);
      $(document.body).data('pomp', data);
    };
    
    var initialize = function() {
      var data = $(document.body).data('pomp');
      // If there's data, we've already initialized;
      if (data) { return; }

      // Set up shared data
      $(document.body).data('pomp', {
        receivers: {},
        channels: {},
        frames: {}
      });

      // Listen for messages
      if (window.addEventListener) {
        window.addEventListener('message', receiveMessage, false);
      } else {
        window.attachEvent('onmessage', receiveMessage);
      }
    };


   $.fn.pomp = {
     createChannel: function(label, url) {
       initialize();
       var data = $(document.body).data('pomp');
       // Create the iframe we'll post messages to
       var ifr = document.createElement('iframe');
       ifr.setAttribute("src", url);
       ifr.style.height = "0px";
       ifr.style.width = "0px";
       document.body.appendChild(ifr);

       data.channels[label] = false;
       // We need to hang on to the frame so we can queue up
       // messages sent before it loads
       data.frames[label] = ifr;
       $(document.body).data('pomp', data);

       // Once the frame is loaded, put its contentWindow in our channel list
       $(ifr).load(function() { 
           data.channels[label] = ifr.contentWindow;
           delete(data.frames[label]);
           $(document.body).data('pomp', data);
       });
     },

     sendMessage: function(channel, args, cb) {
       var data = $(document.body).data('pomp');
       var messageId = 'm' + (Math.random() * (1 << 30)).toString(16);
       args.messageId = messageId;
       data.receivers[messageId] = cb;
       if (! data.channels.hasOwnProperty(channel)) {
         throw "No such channel: " + channel;
       } 
       if (data.channels[channel] === false) {
         // need to wait for iframe to load
         $(data.frames[channel]).load(function() {
             data.channels[channel].postMessage(JSON.stringify(args), '*');
         });
       } else {
         data.channels[channel].postMessage(JSON.stringify(args), '*');
       }
     }
   };
})( jQuery );