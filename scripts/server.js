var koa = require("koa");
var serve = require("koa-static");
var path = require("path");
var Open = require("open");

const httpConfig = {
  port: 9878,
  host: "localhost"
};

let app = koa();

app.use(serve(path.resolve(__dirname, "../demo")));
app.use(serve(path.resolve(__dirname, "../dist/iife")));

app.listen(httpConfig.port, function() {
  console.log(`Server is listening at 'http://${httpConfig.host}:${httpConfig.port}/'...`);
  Open(`http://${httpConfig.host}:${httpConfig.port}/`);
});
