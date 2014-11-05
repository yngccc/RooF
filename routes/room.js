var User = require('../models/user');
var _ = require('underscore');
var helper = require('./helper');
var InRoom = helper.InRoom;
var Authenticated = helper.Authenticated;

module.exports = function(app, redis) {

    app.get('/room/:id', function(req, res) {
	if (!Authenticated(req, res)) { return; }

	var room = 'room:' + req.params.id;
	InRoom(req, res, redis, room, function(inroom) {
	    if (!inroom) { return; }

	    // use hmget to avoid displaying password

	    redis.hgetall(room, function(err, info) {
		if (!info) {
		    res.json({error : 'no such room'});
		    return;
		}
		var roominfo = info;
		redis.smembers(room+':members', function(err, members) {
		    roominfo.members = {};
		    User.find().where('username').in(members).select('username picture')
			.exec(function(err, users) {
			    _.each(users, function(user) {
				roominfo.members[user.username] = user.picture;
			    });
			    res.json(roominfo);
			});
		});
	    });
	});
    });
};



