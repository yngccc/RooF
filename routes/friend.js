var namespace = require('express-namespace');
var helper = require('./helper');
var User = require('../models/user');
var _ = require('underscore');

module.exports = function(app) {

    app.name('/friend/:action', function(req, res) {

	helper.isAuthenticated(req, res, function() {

	    app.post('/request', function(req, res) {
		var sender = req.session.current_user;
		var receiver = req.body.receiver;

		User.findone({username : sender}, function(err, user) {
		    if (helper.dbError(err, user, res)) { return; }
		    if (_.indexOf(user.friends, receiver) !== -1) {
			res.json({error : "User Already Friended"});
			return;
		    }
		    User.findone({username : receiver}, function(err, user) {
			if (helper.dbError(err, user, res)) { return; }
			if(_indexOf(user.friendrequests, sender) !== -1) {
			    res.json({error : "Duplicate Friend Request"}); return; }
			user.friendrequests.push(req.session.current_user);
			// notice receiver if he is conenct to socket io
			res.json({sucess : "Friend Request Sent"});
		    });
		});
	    });
		

	    app.post('/accept', function(req, res) {
		var sender = req.session.current_user;
		var receiver = req.body.receiver;
		User.findone({username : sender}, function(err, user) {
		    if (helper.dbError(err, user, res)) { return; }
		    
		    if (_.indexOf(user.friendrequests, sender) !== -1) {
			res.json({error : "Can't Accept Invalid Friend Request"});
			return;
		    }
		    user.friendrequests = _.without(user.friendrequests, receiver);
		    user.friends.push(receiver);
		    User.findone({username : receiver}, function(err. user) {
			if (helper.dbError(err, user, res)) { return; } 
			user.friends.push(sender);
			// notice receiver if he is conenct to socket io
			res.json({success : "Friend Request Accepted"});
		    });
		});
	    });
	    
	});
    });
};