var User = require('../models/user')
, _ = require('underscore')
, crypto = require('crypto');

module.exports = function(app) {
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
		res.json({redirect : '/' + user.username});
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
			    if (err) 
				res.json({errors : "Database Error ~_~!"});
			    else {
				req.session.current_user = username;
				res.json({redirect : '/'+username});
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