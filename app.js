
/**
 * Module dependencies.
 */

var express = require('express')
, crypto = require('crypto')
, connect = require('connect')
, routes = require('./routes')
, http = require('http')
, path = require('path')
, io = require('socket.io')
, io_auth = require('./socketio_auth')
, mongoose = require('mongoose')
, fs = require('fs');

var options = {
    key : fs.readFileSync('./crypto/privatekey.pem'),
    cert : fs.readFileSync('./crypto/certificate.pem')
};

var app = express.createServer();
var MASTER_KEY = "Apt C58";

app.configure(function(){
    app.set('port', process.env.PORT || 3000);
    app.set('views', __dirname + '/views');
    app.set('view engine', 'jade');
    app.use(express.favicon());
    app.use(express.logger('dev'));
    app.use(express.bodyParser());
    app.use(express.methodOverride());
    app.use(express.cookieParser());    
    app.use(express.session({secret : MASTER_KEY}));
    app.use(app.router);
    app.use(express.static(__dirname + '/public'));
});

app.configure('development', function(){
    app.use(express.errorHandler());
});

var auth = require('./auth');

app.get('/', routes.index);

app.get('/test', function(req, res) {
    res.send(req.session);
});

app.post('/login', auth.authenticate, function(req, res) {
    res.end("logged in");
});

app.get('/logout', auth.destroySession, function(req, res) {
    res.end('logged out');
});

app.get('/secret', auth.isAuthenticated, function(req, res) {
    res.end("secret revealed");
});

mongoose.connect('mongodb://localhost/test')

sio = io.listen(app);
sio.sockets.on('connect', function(socket) {
    socket.send("welcome to socket io");
});
    
app.listen(app.get('port'), function(){
    console.log("Express server listening on port " + app.get('port'));
});
