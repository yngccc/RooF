var User = require('../models/user');

module.exports = function(app) {
    
    app.get('/:username', function(req, res) {
	var username = req.params.username;
	
	// need some middleware to take care of name conflict

	if (req.session && req.session.current_user === username) {
	    res.render("user");
	}
	else 
	    res.end("lol?");
    });

    app.get('/settings/profile', function(req, res) {
	if (req.session && req.session.current_user) {
	    var username = req.session.current_user;
	    User.findOne({username : username}, ['username', 'email'], function(err, user) {
		if (err){res.json({error :"Database Error ~_~!"}); return;}
		res.json(user);
	    });
	}
	else {
	    res.json({errors : ["Require Log In to Edit Profile"]});
	}
    });
};