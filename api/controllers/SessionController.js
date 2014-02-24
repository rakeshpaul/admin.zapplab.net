/**
 * SessionController
 *
 * @module      :: Controller
 * @description	:: A set of functions called `actions`.
 *
 *                 Actions contain code telling Sails how to respond to a certain type of request.
 *                 (i.e. do stuff, then send some JSON, show an HTML page, or redirect to another URL)
 *
 *                 You can configure the blueprint URLs which trigger these actions (`config/controllers.js`)
 *                 and/or override them with custom routes (`config/routes.js`)
 *
 *                 NOTE: The code you write here supports both HTTP and Socket.io automatically.
 *
 * @docs        :: http://sailsjs.org/#!documentation/controllers
 */

var crypto = require('crypto');

function md5(string) {
	return crypto.createHash('md5').update(string).digest('hex');
}

module.exports = {

	/**
	 * Overrides for the settings in `config/controllers.js`
	 * (specific to SessionController)
	 */
	_config: {},

	index: function(req, res) {
		if (req.session.authenticated) {
			res.redirect('/project');
		} else {
			res.view({title: 'zapplab: smart and simple'});
		}
	},

	login: function(req, res, next) {
		// Check for email and password in params sent via the form, if none
		// redirect the browser back to the sign-in form.
		if (!req.param('email') || !req.param('password')) {
			// return next({err: ["Password doesn't match password confirmation."]});

			var usernamePasswordRequiredError = {
				name: 'usernamePasswordRequired',
				message: 'You must enter both a username and password.'
			}

			// Remember that err is the object being passed down (a.k.a. flash.err), whose value is another object with
			// the key of usernamePasswordRequiredError
			req.session.flash = {
				err: usernamePasswordRequiredError
			};

			res.redirect('/');
			return;
		}

		// Try to find the user by there email address. 
		// findOneByEmail() is a dynamic finder in that it searches the model by a particular attribute.
		// User.findOneByEmail(req.param('email')).done(function(err, user) {
		User.findOneByEmail(req.param('email'), function foundUser(err, user) {
			if (err) return next(err);

			// If no user is found...
			if (!user) {
				var noAccountError = {
					name: 'noAccount',
					message: 'The email address ' + req.param('email') + ' not found.'
				};
				req.session.flash = {
					err: noAccountError
				}
				res.redirect('/');
				return;
			}

			if (user.active === false) {
				var inactiveAccountError = {
					name: 'inactiveAccount',
					message: 'Your account is not active. Please activate your account and try again.'
				};
				req.session.flash = {
					err: inactiveAccountError
				};
				res.redirect('/');
				return;
			}
			
			if (!user.admin) {
				var requireAdminError = {
					name: 'requireAdminError',
					message: 'You must be an admin. Please try with an admin user credentials to login.'
				};
				req.session.flash = {
					err: requireAdminError
				};
				res.redirect('/');
				//return res.forbidden('You are not permitted to perform this action.');
				return;
			}

			// Compare password from the form params to the encrypted password of the user found.
			var password = md5(req.param('password'));
			if(password === user.password) {
				// Log user in
				req.session.authenticated = true;
				req.session.User = user;
				// If the user is also an admin redirect to the user list (e.g. /views/user/index.ejs)
				// This is used in conjunction with config/policies.js file
				// if (req.session.User.admin) {
					res.redirect('/project');
					return;
				// } else {
				// 	var usernamePasswordMismatchError = [{
				// 		name: 'usernamePasswordMismatch',
				// 		message: 'Invalid username or password.'
				// 	}]
				// 	req.session.flash = {
				// 		err: usernamePasswordMismatchError
				// 	}
				// 	res.redirect('/session/index');
				// 	return;
				// }

			} else {
				var usernamePasswordMismatchError = {
					name: 'usernamePasswordMismatch',
					message: 'Invalid username or password.'
				};
				req.session.flash = {
					err: usernamePasswordMismatchError
				};
				res.redirect('/session/index');
				return;
			}
		});
	},

	destroy: function(req, res, next) {
		if(req.session && req.session.User) {
			User.findOne(req.session.User.id, function foundUser(err, user) {

				if (err) return next(err);
				// Wipe out the session (log out)
				req.session.destroy();

				// Redirect the browser to the sign-in screen
				res.redirect('/');
			});			
		} else {
			res.redirect('/');
		}
	}
};