module.exports = function(app) {
    app.get('/', function(req, res){
	if (req.session && req.session.current_user) {
	    res.redirect('/' + req.session.current_user);
	}
	else
	    res.render('welcome_mode');
    });
    
    app.get('/webgl', function(req, res) {
	res.render("test");
    });

}