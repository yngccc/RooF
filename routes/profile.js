var User = require('../models/user');
var fs = require('fs');
var helper = require('./helper');
var dbError = helper.dbError;
var Authenticated = helper.Authenticated;

var db = 'test';
__dirname = __dirname.split('/');
__dirname.pop();
__dirname = __dirname.join('/') + '/public/img/';


module.exports = function(app) {
    app.get('/profile', function(req, res) {
	if (!Authenticated(req, res)) { return; }
	var username = req.session.current_user;
	User.findOne({username : username},
		     'username email name bio picture',
		     function(err, user) {
			 if (dbError(err, user, res, username)) { return false; }
			 res.json(user);
		     });
    });
    
    app.post('/profile', function(req, res) {
	if (!Authenticated(req, res)) {return;}
 	var username = req.session.current_user;
	var update = req.body;
	User.findOne({username : username}, function(err, user) {
	    if (dbError(err, user, res, username)) { return false; }
		_.each(update, function(value, key) {
		    user[key] = value;
		});
	    user.save();
	});
    });

    app.post('/profile/picture', function(req, res) {
	if (!Authenticated(req, res)) { return; }
	var username = req.session.current_user;
	User.findOne({username : username}, function(err, user) {
	    if(dbError(err, user, res, username)) { return; }
	    var picture = req.files.picture;
	    if (picture) {
		if (picture.size > 10000000) {
		    res.json({error : "file exceeded 10mb"}); return; }
		fs.rename(picture.path, __dirname + username + '.' + picture.type.split('/')[1], function() {
		    user.picture = '/img/' + username + '.' + picture.type.split('/')[1];
		    user.save();
		    res.json({success : "picture uploaded"});
		});
	    } else 
		res.json({error : "please upload a picture"});
	});
    });
	    
    app.get('/profile/:user', function(req, res) {
	if (!Authenticated(req, res)) { return; }
	var username = req.params.user;
	User.findOne({username : username}, 'bio picture', function(err, user) {
	    if(dbError(err, user, res, username)) { return; }
	    res.json(user);
	});
    });

    app.get('/:username', function(req, res) {
	var username = req.params.username;

	if (req.session && req.session.current_user === username) 
	    res.render("user_mode");
	else 
	    res.json({error : "Access Denied"});
    });
    

};