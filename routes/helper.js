var connect = require('connect');
var User = require('../models/user');
var mongodb = require('mongodb');
    
exports.Authenticated = function(req, res) {
    if (req.session && req.session.current_user) {
	return true;
    }
    res.json({error : "access denied"});
    return false;
};

exports.dbError = function(err, result, res, record) {
    if (err) {
	res.json({error : err});
	return true;
    }
    if (!result) {
	res.json({error : record + " doesn't exist"});
	return true;
    }
    return false;
};
    
exports.InRoom = function(req, res, redis, room, callback) {
    var username = req.session.current_user;
    redis.sismember(room + ':members', username, function(err, member) {
	if (!member) {
	    res.json({error : 'access denied'});
	    callback(false);
	}
	callback(true);
    });
};

// add all prefix of a username/email to redis zset
exports.add_to_redis_search = function(user, redis) {
    var username = user.username;
    for (var i = 1; i < username.length; i++) 
	redis.zadd('users', 0, username.substr(0, i) , redis.print);
    redis.zadd('users', 0, username, 0, username+'*', redis.print);

    var email = user.email;
    for (var i = 1; i < email.length; i++) 
	redis.zadd('emails', 0, email.substr(0, i), redis.print);
    redis.zadd('emails', 0, email, 0, email+'*', redis.print);
};

exports.passRequirement = function(username, password, reserved_name) {
    if (username.length < 2) 
	return false;
    if (reserved_name[username])
	return false;
    if (username[username.length -1] === '*')
	return false;
    if (password.length < 4) 
	return false;
    return true;
};