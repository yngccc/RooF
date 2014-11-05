var User = require("../models/user");
var async = require('async');
var _ = require('underscore');

module.exports = function(app, redis) {
    app.namespace("/search", function() {

	// search for users in autocompletion style using redis zset
	app.get("/username/:username", function(req, res) {
	    var username = req.params.username;
	    var result = [];
	    var count = 0;
	    
	    redis.zrank('users', username, function(err, index) {
		if (index === null) {
		    res.json(result);
		    return;
		}

		async.whilst(
		    // return up to 10 results, change this number if u want more
		    function() { return count < 10 },
		    function(callback) { 
			redis.zrange('users', index, index+50-1, function(err, prefix) {
			    if (!prefix || prefix.length === 0) {
				callback('end');
				return;
			    }
			    for (var i = 0; i < prefix.length; i++) {
				var p = prefix[i];
				var l = Math.min(p.length, username.length);
				if (p.slice(0, l) !== username.slice(0, l)) {
				    callback('end');
				    return;
				}
				if (p[p.length -1] === '*') {
				    result.push(p.slice(0, -1));
				    count += 1;
				}				
			    }
			    index += 50;
			    callback();
			});
		    },
		    function(done) {
			// query users from mongo
			User.where('username')
			    .in(result)
			    .select('username picture -_id')
			    .exec(function(err, users) {
				// this is stupid, users is not modifiable for some reason(bug?),
				// so I copy users into new variable dummy
				var dummy = [];
				for (var i=0; i<users.length; i++) {
				    var dummy2 = {};
				    dummy2.picture = users[i].picture;
				    dummy2.username = users[i].username;
				    dummy[i] = dummy2;
				}
				// check online status of each users
				async.forEach(dummy,
					      function(user, callback) {
						  redis.sismember("user:online", user.username, function(err, online) {
						  	  user.online = (online === 1 ? true : false);
						  	  callback();
						  });
					      },
					      // all done
					      function() {
						  res.json(dummy);
					      });
			    });
		    }
		);
	    });
	});
	
	// app.get("/email/:email", function(req, res) {
	//     var email = req.params.email;
	//     var result = [];
	//     var count = 0;
	//     var end = false;
	//     redis.zrank('emails', email, function(err, index) {
	// 	if (index === null) {
	// 	    res.json(result);
	// 	    return;
	// 	}

	// 	async.whilst(
	// 	    function() { return count < 10 },
	// 	    function(callback) { 
	// 		redis.zrange('emails', index, index+50-1, function(err, prefix) {
	// 		    if (!prefix || prefix.length === 0)
	// 			callback('end');
	// 		    for (var i = 0; i < prefix.length; i++) {
	// 			var p = prefix[i];
	// 			var l = Math.min(p.length, email.length);
	// 			if (p.slice(0, l) !== email.slice(0, l))
	// 			    callback('end');
	// 			if (p[p.length -1] === '*') {
	// 			    result.push(p.slice(0, -1));
	// 			    count += 1;
	// 			}				
	// 		    }
	// 		    index += 50;
	// 		    callback();
	// 		});
	// 	    },
	// 	    function(done) {
	// 		res.json(result);
	// 	    }
	// 	);
	//     });
	// });


    });
};	

			