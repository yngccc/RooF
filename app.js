var express = require('express')
, crypto = require('crypto')
, connect = require('connect')
, redisStore = require('connect-redis')(express)
, http = require('http')
, io = require('socket.io')
, mongoose = require('mongoose')
, redis = require('redis').createClient();

require("express-namespace");

var app = express();

var MASTER_KEY = "NEVERGONNAGIVEUP";
var sessionStore = new redisStore();

app.configure(function(){
    app.set('port', process.env.PORT || 80);
    app.set('views', __dirname + '/views');
    app.set('view engine', 'jade');
    app.use(express.favicon());
    app.use(express.logger('dev'));
    app.use(express.bodyParser());
    app.use(express.methodOverride());
    app.use(express.cookieParser());    
    app.use(express.session({store : sessionStore, secret : MASTER_KEY}));
    app.use(app.router);
    app.use(express.static(__dirname + '/public'));
});

app.configure('development', function(){
    app.use(express.errorHandler());
});

require('./routes/welcome')(app);
require('./routes/auth')(app, redis);
require('./routes/search')(app, redis);
require('./routes/friend')(app, redis);
require('./routes/room')(app, redis);
require('./routes/profile')(app);

mongoose.connect('mongodb://localhost/test')

var server = http.createServer(app);

var sio = io.listen(server);
require('./sio/setup.js')(sio, sessionStore, redis);

server.listen(app.get('port'), function(){
    console.log("Express server listening on port " + app.get('port'));
});

