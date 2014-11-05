
exports.add_to_redis_rooms = function(data, redis, socket, callback) {
    redis.incr('room.id', function(err, id) {
	redis.hmset('room:'+id, 
		    'name', data.roomName, 'type', data.roomType, function() {
			redis.sadd('room:'+id+':members', socket.user, function() {
			    redis.lpush('room:'+id+':history',
					socket.user + ': has created the room',
					callback(id));
			});
		    });
    });
}


exports.verify_join_credential = function(data, redis, callback) {
    redis.hget('room:' + data.id, 'password', function(err, password) {
	if (!password || password === data.password) {
	    callback(true);
	    return;
	}
	callback(false);
    });
};


exports.verify_message_credential = function(data, redis, callback) {
    var id = data.id;
    var user = data.user;
    redis.sismember('room:' + id + ':members', user, function(err, ismember) {
	callback(ismember);
    });
}