
module.exports = function(app, redis) {

    app.get('/message', function(req, res) {
	var user = req.session.current_user;
	User.findOne({username : user}, 'messages', function(err, user) {
	    Message.where('_id')
	           .in(user.messages)
                   .exec(function(messages) {
		       res.json(messages);
		   });
	});
    });

    app.post('/message/:user', function(req, res) {
	var _sender_ = req.session.current_user;
	var _receiver_ = req.params.user;
	var _message_ = req.body.message;
	User.findOne({username : _receiver_}, function(err, receiver) {
	    
    });

    app.post('/message'p