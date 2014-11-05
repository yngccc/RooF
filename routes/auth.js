"use strict";

var User = require('../models/user');
var _ = require('underscore');
var crypto = require('crypto');
var helper = require('./helper');
var add_to_redis_search = helper.add_to_redis_search;
var passRequirement = helper.passRequirement;

module.exports = function(app, redis) {

    app.post('/login', function(req, res) {
	var email = req.body.email.toLowerCase();
	var password = req.body.password;

	User.findOne({email : email}, function(err, user) {
	    if (err) {res.json({error : "Database Error"}); return;}
	    if (!user) {res.json({error : "Invalid Email or Password"}); return;}
	    crypto.pbkdf2(password, user.salt, 1000, 32, function(err, pass) {
		pass = Buffer(pass, 'binary').toString('hex');
		if (pass !== user.password) {
		    res.json({error : "Invalid Email or Password"}); return; }
		req.session.current_user = user.username;
		res.json({redirect : user.username});
	    });
	});
    });


    // username requirement : at least 2 characters, cannot be reserved words below
    // password requirement : at least 4 characters.
    var reserved_name = {'profile':true, 'friend':true, 'picture':true, 'login':true,
			 'signup':true, 'logout':true, 'room':true, 'search':true};

    app.post('/signup', function(req, res) {
	var username = req.body.username.trim().toLowerCase();
	var email = req.body.email.trim().toLowerCase();
	var password = req.body.password;
	if (!passRequirement(username, password, reserved_name)) { 
	    res.json({error : "inappropriate username/password/email"});
	    return; 
	}
	var response = {errors: []};
	User.findOne({username : username}, function(err, user) {
	    if (user) response.errors.push("Username Already Taken");
	    User.findOne({email : email}, function(err, user) {
		if (user) response.errors.push("Email Already Taken");
		if (_.isEmpty(response.errors)) {
		    var new_user = new User({username : username,
					     email : email,
					     password : password});
		    // create gravatar img
		    var md5 = crypto.createHash('md5');
		    md5.update(new_user.email, 'utf8');
		    var hash = md5.digest('hex');
		    new_user.picture = "http://www.gravatar.com/avatar/" + hash + "?d=mm";
		    // hash password
		    new_user.encodePassword(password, function(err, pass) {
			if (err) {console.log(err); return;}
			new_user.password = pass;
			new_user.save(function() {
			    // append username/email to redis for fast search
			    add_to_redis_search(new_user, redis);
			    // all done, give user access
			    req.session.current_user = username;
			    res.json({redirect : username});
			});
		    });
		}
		else 
		    res.json(response);
	    });
	});
    });
    
    app.get('/logout', function(req, res) {
	req.session.destroy();
	res.redirect('/');
    });

};