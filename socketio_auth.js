var cookie = require('cookie');

var MASTER_KEY = "Apt C58";

exports.setup_auth = function(sio, sessionStore) {
    sio.set('authorization', function(data, accept) {
	if (!data.headers.cookie) 
	    return accept("Session cookie required.", false);
	data.cookie = cookie.parse(data.headers.cookie);
	data.sessionID = data.cookie['connect.sid'];

	sessionStore.get(data.sessionID, function(err, session) {
	    if (err) 
		return accept('Error in session store.', false);
	    else if (!session) 
		return accept('Session not found.', false);
	    data.session = session;
	    return accept(null, true);
	});
    });
};
