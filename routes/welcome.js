
module.exports = function(app) {
    app.get('/', function(req, res){
	if (req.session && req.session.current_user) {
	    res.redirect('/' + req.session.current_user);
	}
	else
	    res.render('welcome');
    });

    app.get('/test', function(req, res) {
	res.json({two: 2});
    });
}