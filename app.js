
/**
 * Module dependencies.
 */

var express = require('express')
, routes = require('./routes')
, http = require('http')
, path = require('path')
, io = require('socket.io')
, mongoose = require('mongoose')
, fs = require('fs');

var app = express();
var server = http.createServer(app);
io = io.listen(server);

app.configure(function(){
  app.set('port', process.env.PORT || 3000);
  app.set('views', __dirname + '/views');
  app.set('view engine', 'jade');
  app.use(express.favicon());
  app.use(express.logger('dev'));
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(app.router);
  app.use(express.static(__dirname + '/public'));
});

app.configure('development', function(){
  app.use(express.errorHandler());
});

app.get('/', routes.index);

app.get('/albums', function(req, res) {
    fs.readFile(__dirname + '/public/albums.json', function(err, data) {
	res.json(JSON.parse(data));
    });
});

server.listen(app.get('port'), function(){
  console.log("Express server listening on port " + app.get('port'));
});
