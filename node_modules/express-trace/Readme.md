
# express-trace

  Express tracer and middleware profiler.

## Installation

     $ npm install express-trace

__NOTE__: supports express >= 2.3.5

## Example

 Suppose we have the following express app with a few routes that can satisfy a url with the form `GET /user/NAME`, and some middlware

    app.use(express.favicon());
    app.use(express.bodyParser());
    app.use(express.methodOverride());
    app.use(express.cookieParser());
    app.use(express.session({ secret: 'foo' }));
    app.use(express.static(__dirname));

    app.get('/user/:name', ensureUsername('tj'), function(req, res, next){
      res.send('loaded tj');
    });

    app.get('/user/:name', function(req, res, next){
      setTimeout(next, 1000);
    });

    app.get('/user/:name', function(req, res, next){
      setTimeout(next, 200);
    });

    app.get('/user/tobi', function(req, res, next){
      res.send('loaded tobi');
    });

all we need to do before we `listen()`, is `require()` express-trace and apply it to the app. This essentially wraps all of the middleware and routes with functions used for reporting.

    require('express-trace')(app);

stderr for `GET /user/tobi`:

      GET /user/tobi
      middleware / anonymous 1ms
      middleware / favicon 0ms
      middleware / bodyParser 0ms
      middleware / methodOverride 0ms
      middleware / cookieParser 0ms
      middleware / session 1ms
      middleware / static 0ms
      middleware / router
        app.get(/user/:name) 0ms
          middleware ensureUsername 73ms
        app.get(/user/:name) 1000ms
        app.get(/user/:name) 200ms
        app.get(/user/tobi) 
      responded to GET /user/tobi in 1279ms with 200 "OK"

## License 

(The MIT License)

Copyright (c) 2011 TJ Holowaychuk &lt;tj@vision-media.ca&gt;

Permission is hereby granted, free of charge, to any person obtaining
a copy of this software and associated documentation files (the
'Software'), to deal in the Software without restriction, including
without limitation the rights to use, copy, modify, merge, publish,
distribute, sublicense, and/or sell copies of the Software, and to
permit persons to whom the Software is furnished to do so, subject to
the following conditions:

The above copyright notice and this permission notice shall be
included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED 'AS IS', WITHOUT WARRANTY OF ANY KIND,
EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT.
IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY
CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT,
TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE
SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.