var _ = require('underscore');
var helper = require('./helper');
var Authenticated = helper.Authenticated;
var User = require('../models/user');
var FriendRequest = require('../models/friendRequest');
var ObjectId = require('mongoose').Types.ObjectId;
var async = require('async');

module.exports = function(app, redis) {
    app.namespace('/friend', function() {

	app.all('/*', function (req, res, next) {
	    if (Authenticated(req, res)) { next(); }
	});
	
	app.get('/profiles', function(req, res) {
	    var _user_ = req.session.current_user;
	    User.findOne({username : _user_}, 'friends', function(err, user) {
		if (helper.dbError(err, user, res, _user_)) { return; }
		User.where('username')
		    .in(user.friends)
		    .select('username email name bio picture')
		    .exec(function(err, friends) {
			res.json(friends);
		    });
	    });
	});

	app.get('/profile/:username', function(req, res) {
	    var user = req.session.current_user;
	    var friend = req.params.username;
	    User.findOne({username : friend}, 'username email name bio picture friends -_id', function(err, friendInfo) {
		if (_.indexOf(friendInfo.friends, user) === -1) {
		    res.json({error : "cannot view stranger's profile"}); return; }
		delete friendInfo._doc.friends;
		res.json(friendInfo);
	    });
	});

	app.get('/online', function(req, res) {
	    var user = req.session.current_user;
	    var friends = req.query.friends;
	    var result = [];
	    async.forEach(friends,
			  function(friend, callback) {
			      redis.sismember('user:online', friend, function(err, online) {
				  if (online) result.push({username:friend, online:true});
				  else        result.push({username:friend, online:false});
				  callback();
			      });
			  },
			  function(err) {
			      res.json(result);
			  });
	});
		

	app.get('/requests', function(req, res) {
	    var _user_ = req.session.current_user;
	    User.findOne({username : _user_}, 'friendrequests', function(err, user) {
		if (helper.dbError(err, user, res, _user_)) { return; }
		FriendRequest.where('_id')
		    .in(user.friendrequests)
		    .exec(function(err, requests) {
			res.json(requests);
		    });
	    });
	});
	
	app.post('/request', function(req, res) {
	    var _sender_ = req.session.current_user;
	    var _receiver_ = req.body.receiver;
	    var _message_ = req.body.message;

	    if (_sender_ === _receiver_) {
		res.json({error : "cannot add yourself as friend"}); return; }
	   
	    User.findOne({username : _sender_}, function(err, sender) {
		if (helper.dbError(err, sender, res, _sender_)) { return; }
	
		if (_.indexOf(sender.friends, _receiver_) !== -1) {
		    res.json({error : _receiver_ + " already friended"}); return; }

		User.findOne({username : _receiver_}, function(err, receiver) {
		    if (helper.dbError(err, receiver, res, _receiver_)) { return; }

		    FriendRequest.findOne({sender : _sender_, receiver : _receiver_}, function(err, request) {
			if (request) {
			    res.json({error : "you already sent this person a request"}); return; }
			FriendRequest.findOne({sender : _receiver_, receiver : _sender_}, function(err, request) {
			    if (request) {
				res.json({error : "this person already sent you a friend request, please check your request box"}); return; }
			    
			    var new_request = new FriendRequest({sender : _sender_,
								 receiver : _receiver_,
								 message : _message_ });
			    
			    new_request.save(function() {
				receiver.friendrequests.push(new_request._id);
				receiver.save();
				// check if that user is online
				redis.sismember('user:online', _receiver_, function(err, online) {
				    if (online) 
					res.json({success : "friend request sent to " + _receiver_, online : true, request : new_request});
				    else
					res.json({success : "friend request send to " + _receiver_, online : false});
				});
			    });
			});
		    });
		});
	    });
	});
		
	    
	app.post('/accept', function(req, res) {
	    var _sender_ = req.session.current_user;
	    var _id_ = req.body.id;
	    FriendRequest.findById(_id_, function(err, request) {
		if (request.receiver !== _sender_) { return; }
		User.findOne({username : _sender_}, function(err, sender) {
		    if (helper.dbError(err, sender, res, _sender_)) { return; }
		    
		    var _receiver_ = request.sender;
		    User.findOne({username : _receiver_}, function(err, receiver) {
			if (helper.dbError(err, sender, res, _sender_)) { return; }
			
			request.remove();
			sender.friendrequests.pull(_id_);
			sender.friends.push(_receiver_);
			receiver.friends.push(_sender_);
			sender.save();
			receiver.save();

			// check if receiver is online
			redis.sismember('user:online', _receiver_, function(err, online) {
			    if (online) 
				res.json({success : "Accepted " + _receiver_ + " as friend", online : true, request : request});
			    else
				res.json({success : "Accepted " + _receiver_ + " as friend", online : false});
			});
		    });
		});
	    });
	});
	    
	app.post('/decline', function(req, res) {
	    var _sender_ = req.session.current_user;
	    var _id_ = req.body.id;

	    FriendRequest.findById(_id_, function(err, request) {
		if (request.receiver !== _sender_) { return; }
		
		var _receiver_ = request.sender;
		User.findOne({username : _sender_}, function(err, sender) {

		    request.remove();
		    sender.friendrequests.pull(_id_);
		    sender.save();
		    
		    // check if receiver is online
		    redis.sismember('user:online', _receiver_, function(err, online) {
			if (online) 
			    res.json({success : "removed " + _receiver_ + "'s friend request", online : true});
			else
			    res.json({success : "removed " + _receiver_ + "'s friend request", online : false});
		    });
		});
	    });
	});

	app.post('/remove', function(req, res) {
	    var _user_ = req.session.current_user;
	    var _removal_ = req.body.removal;
	    User.findOne({username : _user_}, function(err, user) {
		if (helper.dbError(err, user, res, _user_)) { return; }
		if (_.indexOf(user.friends, _removal_) !== -1) {
		    user.friends.pull(_removal_);
		    User.findOne({username : _removal_}, function(err, removal) {
			if (helper.dbError(err, removal, res, _removal_)) { return; }
			removal.friends.pull(_user_);
			user.save(); 
			removal.save();
			res.json({success : _removal_ + " removed from friends"});
		    });
		} else 
		    res.json({error : _removal_ + " is not your friend"});
	    });
	});

 
    });
};
