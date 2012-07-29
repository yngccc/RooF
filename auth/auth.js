var connect = require('connect');
var User = require('../models/user')
    
exports.isAuthenticated = function(req, res, next) {
    if (req.session && req.session.current_user) {
	next();
	return;
    }
    res.end("Access Denied");
}

    
     

    