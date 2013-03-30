var passport = require('passport'),
LocalStrategy = require('passport-local').Strategy;

var BAD_LOGIN_STRING = 'Invalid username or password'

module.exports = function(app) {
	var strategy = new LocalStrategy(
	{
		usernameField: 'username',
		passwordField: 'password'
	},
	function (username, password, done) {
		console.log('starting local strategy');
		app.models.User.findOne({username: username}, function (err, user) {
			console.log('user = ' + user);
			if (err) return done(err);
			if (!user) return done(null, false, { message:BAD_LOGIN_STRING });
			if (user.authenticate(password)) return done(null, user);
			else return done(null, false, { message:BAD_LOGIN_STRING });
		});
	});

	passport.serializeUser(function (user, done) {
		done(null, user.id);
	});

	passport.deserializeUser(function (id, done) {
		app.models.User.findById(id, function(err, user){
			done(err, user);
		});
	});

	passport.use(strategy);

	passport.setLocals = function(req, res, next) {
		if(req.isAuthenticated()) {
			res.locals.user = req.user;
		}
		return next();
	}

	return passport;
}
