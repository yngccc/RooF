var User = require('../models/user');

module.exports = function(app) {
    app.get('/profile', function(req, res) {
	if (req.session && req.session.current_user) {
	    var username = req.session.current_user;
	    User.findOne({username : username},
			 ['username', 'email','name', 'bio', 'messages', 'friends' ],
			 function(err, user) {
			     if (err){res.json({error :"Database Error ~_~!"}); return;}
			     res.json(user);
			 });
	} else {
	    res.json({error : "Login Required to Retrieve Profile"});
	}
    });
    

    app.get('/:username', function(req, res) {
	var username = req.params.username;

	if (req.session && req.session.current_user === username) {
	    res.render("user");
	} else 
	    res.end("lol?");
    });
    

};