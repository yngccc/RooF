var auth = require("../auth/auth")
, User = require('../models/user')
, _ = require('underscore')
, crypto = require('crypto');

module.exports = function(app) {
    app.post('/login', function(req, res) {
	var email = req.body.email.toLowerCase();
	var password = req.body.password;

	User.findOne({email : email}, function(err, user) {
	    if (err) {res.json({errors : ["Database Error"]}); return;}
	    if (!user) {res.json({errors : ["Invalid Email or Password"]}); return;}
	    crypto.pbkdf2(password, user.salt, 1000, 32, function(err, pass) {
		pass = Buffer(pass, 'binary').toString('hex');
		if (pass !== user.password) {
		    res.json({errors : ["Invalid Email or Password"]}); return; }
		req.session.current_user = user.username;
		res.json({success : '/' + user.username});
	    });
	});
    });
	    
		
    app.post('/signup', function(req, res) {
	var username = req.body.username.toLowerCase();
	var email = req.body.email.toLowerCase();
	var password = req.body.password;
	
	var response = {errors: []};
	User.findOne({username : username}, function(err, user) {
	    if (user) response.errors.push("Username Already Taken");
	    User.findOne({email : email}, function(err, user) {
		if (user) response.errors.push("Email Already Taken");
		if (_.isEmpty(response.errors)) {
		    var new_user = new User({username : username,
					     email : email,
					     password : password});
		    
		    new_user.encodePassword(password, function(err, pass) {
			if (err) {console.log(err); return;}
			new_user.password = pass;
			new_user.save(function(err) {
			    if (err) {
				console.log(err);
				response.errors.push("Database Error ~_~!");
				res.json(response);
			    } else {
				req.session.current_user = username;
				response.success = '/' + username ;
				res.json(response);
			    }
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