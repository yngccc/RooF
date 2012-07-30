
/**
 * Module dependencies.
 */

var express = require('express')
, crypto = require('crypto')
, connect = require('connect')
, redisStore = require('connect-redis')(express)
, http = require('http')
, io = require('socket.io')
, mongoose = require('mongoose')

// var options = {
//     key : fs.readFileSync('./crypto/privatekey.pem'),
//     cert : fs.readFileSync('./crypto/certificate.pem')
// };


var app = express();

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
    app.use(express.session({store : new redisStore(), secret : MASTER_KEY}));
    app.use(app.router);
    app.use(express.static(__dirname + '/public'));
});

app.configure('development', function(){
    app.use(express.errorHandler());
});

require('./routes/welcome')(app);
require('./routes/auth')(app);
require('./routes/user')(app);


mongoose.connect('mongodb://localhost/test')

var server = module.exports = http.createServer(app);

sio = io.listen(server);
sio.sockets.on('connect', function(socket) {
    socket.send("welcome to socket io");
});
    
server.listen(app.get('port'), function(){
    console.log("Express server listening on port " + app.get('port'));
});
