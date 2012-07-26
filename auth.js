var connect = require('connect');
var User = require('./model').User;
    
exports.destroySession = function(req, res , next) {
    req.session.destroy();
    next();
    return;
}

exports.isAuthenticated = function(req, res, next) {
    if (req.session && req.session.auth === true) {
	next();
	return;
    }
    res.end("Access Denied");
}

exports.authenticate = function(req, res, next) {
    var email = req.body.email;
    var password = req.body.password;
    User.findOne({email : email, password : password}, function(err, user) {
	if (err) {res.end("Database Error"); return;}
	if (!user) {res.end("Invalid Email or Password"); return;}
	req.session.auth = true;
	next();
	return;
    });
}
    
     

    