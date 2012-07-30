var connect = require('connect');
var User = require('../models/user')
    
exports.isAuthenticated = function(req, res, next) {
    if (req.session && req.session.current_user) {
	next();
	return;
    }
    res.json({error : "Access Denied"});
};

exports.dbError = function(err, result, res) {
    if (err) {
	res.json({error : "Database Error ~_~!"});
	return true;
    }
    if (!result) {
	res.json({error : "Record Doesn't Exist"});
	return true;
    }
    return false;
};
    
     

    