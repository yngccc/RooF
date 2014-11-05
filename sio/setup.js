var _ = require('underscore');
var util = require('./util');
var setup_authentication = util.setup_authentication;
var exceedRoomLimit = util.exceedRoomLimit;
var setup_socket_info = util.setup_socket_info;
var add_to_sockets = util.add_to_sockets;
var remove_from_sockets = util.remove_from_sockets;
var add_to_online_users = util.add_to_online_users;
var remove_from_online_users = util.remove_from_online_users;
var redis_ = require('./redis');
var add_to_redis_rooms = redis_.add_to_redis_rooms;
var verify_join_credential = redis_.verify_join_credential;
var verify_message_credential = redis_.verify_message_credential;

module.exports = function(sio, sessionStore, redis) {

    setup_authentication(sio, sessionStore);
    var Sockets = {};

    sio.sockets.on('connection', function(socket) {
	setup_socket_info(socket);
	add_to_sockets(socket, Sockets);
	add_to_online_users(socket, redis);
		
	socket.on('friend-request', function(data) {
	    Sockets[data.request.receiver].emit('friend-request', {request : data.request});
	});

	socket.on('friend-accept', function(data) {
	    Sockets[data.request.sender].emit('friend-accept', {receiver : data.request.receiver});
	});
		 
	socket.on('create-room', function(data) {
	    if (exceedRoomLimit(socket)) return;

	    add_to_redis_rooms(data, redis, socket, function(id) {
	    	socket.join('room:'+id);		
		socket.emit('room-avaliable', {id : id});
		socket.numRoom += 1;
	    });
	});
	
	socket.on('join-room', function(data) {
	    if (exceedRoomLimit(socket)) return;
	    var id = data.id;
	    redis.exists('room:' + id, function(err, exist) {
		if (!exist) {
		    socket.emit('room-not-avaliable', 'no such room');
		    return;
		}
		verify_join_credential(data, redis, function(verified) {
		    if (!verified) {
			socket.emit('room-not-avaliable', 'cannot join room');
			return;
		    }
		    redis.sadd('room:'+id+':members', socket.user, function() {
			socket.numRoom += 1;
			socket.join('room:'+id);
			socket.emit('room-avaliable', {id : id});
			socket.broadcast.to('room:'+id).emit('people-join',
							     {id : id, user : socket.user});
			redis.lrange('room:'+id+':history', 0, 99, function(err, history) {
			    socket.emit('chat-history', history);
			});
		    });
		});
	    });
	});
		  
	socket.on('leave-room', function(data) {
	    var id = data.id;
	    redis.srem('room:'+id+':members', socket.user, function(err, remove) {
		if (remove) {
		    socket.numRoom -= 1;
		    redis.exists('room:'+id+':members', function(err, exist) {
			if (!exist)
			    redis.del('room:'+id, 'room:'+id+':history', redis.print);
			socket.leave('room:' + id);
			socket.broadcast.to('room:'+id).emit('people-leave', {id : id, user : socket.user});
		    });
		}
	    });
	});

	socket.on('chat-message', function(data) {
	    data.user = socket.user;
	    verify_message_credential(data, redis, function(verified) {
		if (!verified) 
		    return;
		var id = data.id;
		var msg = data.msg;
		var user = data.user;
		socket.broadcast.to('room:' + id).emit('chat-message', 
						       {id:id, user:user, msg:msg});
		var history = 'room:' +id + ':history';
		redis.lpush(history, user + ': ' + msg, redis.print);
		redis.ltrim(history, 0, 99, redis.print);
	    });
	});

	socket.on('disconnect', function() {
	    remove_from_sockets(socket, Sockets);
	    remove_from_online_users(socket, redis);
	    var rooms = sio.sockets.manager.roomClients[socket.id];
	    rooms = _.keys(rooms).slice(1);
	    _.each(rooms, function(room) {
		room = room.slice(1);
		redis.srem(room+':members', socket.user, function() {
		    redis.exists(room+':members', function(err, exist) {
			if (!exist)
			    redis.del(room, room + ':history', redis.print);
			var id = parseInt(room.slice(5));
			socket.broadcast.to(room).emit('people-leave', {id : id,  user : socket.user});
		    });
		});
	    });
	});

    });
};
		  

