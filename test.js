var _ = require('underscore');


var a = {one:1, two:2, three:3};

var User = function User(user) {

    _.each(_.keys(user), function(key) {
	this[key] = user[key];
    });
};


user = new User({name : "john", gender : "male", grade : "4th"});

console.log(user);