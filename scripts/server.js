var koa = require("koa");
var serve = require("koa-static");
var path = require("path");
var Open = require("open");
var portfinder = require('portfinder');

let app = koa();

app.use(serve(path.resolve(__dirname, "../demo")));
app.use(serve(path.resolve(__dirname, "../dist/iife")));

portfinder.getPort({port: 9878}, function (err, port) {
  var host = 'localhost';
  app.listen(port, function() {
    console.log(`Server is listening at 'http://${host}:${port}/'...`);
    Open(`http://${host}:${port}/`);
  });
});
