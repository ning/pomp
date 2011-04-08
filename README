pomp.js
========

pomp.js is a bare-bones jQuery plugin to facilitate HTML5 postMessage cross-domain communication.

**Getting Started**

To use pomp.js to allow a page hosted on client.example.com to easily make requests to server.example.org:

1. Copy proxy.html some place on server.example.org. Let's say that's http://server.example.org/proxy.html

2. Edit the allowed_urls line in proxy.html:

        var allowed_urls = [ RegExp("^/api/"), RegExp("^/version$") ]

    This is a whitelist of server.example.org URLs that it will accept for proxying.

3. On a page on client.example.com, do what example.html does:

    * create a channel using `$.fn.pomp.createChannel`. The first argument is an arbitrary label for the channel, the second argument is the URL where you put proxy.html

    * Call `$.fn.pomp.sendMessage()` when you want to send a message. The first argument is the label of the channel.
      The second argument is a hash of request properties, whose meaning is exactly what they are when used with `$.ajax()`.
      "type" and "url" are required; "contentType", "processData", and "data" are optional.
      The third argument is a callback that will be invoked with the response body.

4. Luxuriate in your delightful cross-domain communication.

**Further Thoughts**

There's no fallback to communication using location.hash or anything like that if the active browser doesn't support HTML5 postMessage. ¡Viva la Revolución!

Channel labels allow you to have multiple channels on a page and send messages to each of them independently.

Internally, pomp.js assigns each message a unique ID so that the callbacks are routed properly.

Some nice future enhancements might be:
- allowing different success and error callbacks
- taking the per-message callbacks from success and error elements of the request properties instead of a separate argument
- Allowing for some restriction of messages being send/received only with certain origins.
- returning more than just response body (status code, etc.)


