var spawn = require('child_process').spawn;

function queue()  {
    var args = [].slice.call(arguments);
    var cb = args.pop();
    go(args.shift());
    function go (fn) {
	if (!fn) return cb();
	fn(function (er) {
	    if (er) return cb(er);
	    go(args.shift());
	});
    }
}


var children = [];

queue(
    function(cb) {
	children.push(spawn('redis-server'));
	cb();
    },
    function(cb) {
	children.push(spawn('mongod'));
	cb();
    },
    function(err) {
	if (err) throw err;
	
	console.log('\n\n -------Server Started------- \n\n');
	require('./app.js');
    }
);
