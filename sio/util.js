var parseSignedCookies = require('connect').utils.parseSignedCookies;
var parse = require('cookie').parse;
var MASTER_KEY = "NEVERGONNAGIVEUP";

exports.setup_authentication = function (io, sessionStore) {
    io.configure(function() {
	io.set('authorization', function(data, next) {
	    if (!data.headers.cookie) {
		next('cookie required', false);
		return;
	    }
	    var cookie  = parseSignedCookies(parse(decodeURIComponent(data.headers.cookie)), MASTER_KEY);
	    var sessionID = cookie['connect.sid'];
	    sessionStore.get(sessionID, function(err, session) {
		if (err || !session) {
		    next('unverified session', false);
		    return;
		}
		if (!session.current_user) {
		    next('not logged in', false);
		    return;
		}
		data.session = session;
		next(null, true);
	    });
	});
    });
};

exports.setup_socket_info = function (socket) {
    socket.user = socket.handshake.session.current_user;
    socket.numRoom = 0;
};

exports.add_to_sockets = function (socket, sockets) {
    sockets[socket.user] = socket;
};

exports.remove_from_sockets = function(socket, sockets) {
    delete sockets[socket.user];
};

exports.add_to_online_users = function(socket, redis) {
    redis.sadd('user:online', socket.user, redis.print);
};

exports.remove_from_online_users = function(socket, redis) {
    redis.srem('user:online', socket.user, redis.print);
};

exports.exceedRoomLimit = function (socket) {
    if (socket.numRoom > 5) {
	socket.emit('room-not-avaliable', 'you can be in up to 5 rooms only');
	return true;
    }
    return false;
}
