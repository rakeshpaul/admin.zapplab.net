/**
 * UserController
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

module.exports = {

	/**
	* Overrides for the settings in `config/controllers.js`
	* (specific to UserController)
	*/
	_config: {},

	index: function(req, res) {
		User.find(function getAllUsers(err, users) {
			if(err) return next(err);
			res.view({
				title: "dW users ",
				users: users
			});
		});
	},

	activate: function(req, res, next) {
		console.log('inside user > activate');
		User.findOne({
			id: req.param('id')
		}).done(function(err, user) {

			// Error handling
			if (err) {
				req.session.flash = {
					err: err
				};
				return next(err);
			}
			if (!user) {
				req.session.flash = {
					err: "Error activating user! User doesn't exist"
				};
				return res.redirect('/user');
			}

			User.update({
					id: req.param('id')
				}, {
					active: true
				},
				function(err) {
					console.log('inside user > activate > err' + JSON.stringify(err));
					// Error handling
					if (err) {
						req.session.flash = {
							err: 'Error activating user <strong>' + user.name + '</strong>.'
						};
						return res.redirect('/user');
					}
					req.session.flash = {
						msg: 'Successfully activated user <strong>' + user.name + '</strong>.'
					};
					return res.redirect('/user');
				});
		});

	},

	deactivate: function(req, res, next) {
		console.log('inside user > deactivate');
		User.findOne({
			id: req.param('id')
		}).done(function(err, user) {

			// Error handling
			if (err) {
				// Found multiple users!
				req.session.flash = {
					err: err
				};
				return next(err);

			}
			if (!user) {
				req.session.flash = {
					err: "Error activating user! user doesn't exist"
				};
				return res.redirect('/user');
			}

			User.update({
					id: req.param('id')
				}, {
					active: false
				},
				function(err) {
					console.log('inside user > deactivate > err' + JSON.stringify(err));
					// Error handling
					if (err) {
						req.session.flash = {
							err: 'Error disabling user <strong>' + user.name + '</strong>.'
						};
						return res.redirect('/user');
					}
					req.session.flash = {
						msg: 'Successfully disabled user <strong>' + user.name + '</strong>.'
					};
					return res.redirect('/user');
				});
		});
	},

	makeadmin: function(req, res, next) {
		console.log('inside user > makeadmin');
		User.findOne({
			id: req.param('id')
		}).done(function(err, user) {

			// Error handling
			if (err) {
				// Found multiple users!
				req.session.flash = {
					err: err
				};
				return next(err);

			}
			if (!user) {
				req.session.flash = {
					err: "Error changing user to admin! user doesn't exist"
				};
				return res.redirect('/user');
			}

			User.update({
					id: req.param('id')
				}, {
					admin: true
				},
				function(err) {
					console.log('inside user > makeadmin > err' + JSON.stringify(err));
					// Error handling
					if (err) {
						req.session.flash = {
							err: 'Error changing user <strong>' + user.name + '</strong>. to admin user'
						};
						return res.redirect('/user');
					}
					req.session.flash = {
						msg: 'Successfully changed user <strong>' + user.name + '</strong>. to an admin user'
					};
					return res.redirect('/user');
				});
		});
	},

	revokeadmin: function(req, res, next) {
		console.log('inside user > revokeadmin');
		User.findOne({
			id: req.param('id')
		}).done(function(err, user) {

			// Error handling
			if (err) {
				// Found multiple users!
				req.session.flash = {
					err: err
				};
				return next(err);

			}
			if (!user) {
				req.session.flash = {
					err: "Error revoking admin rights for user! user doesn't exist"
				};
				return res.redirect('/user');
			}

			User.update({
					id: req.param('id')
				}, {
					admin: false
				},
				function(err) {
					console.log('inside user > revoke > err' + JSON.stringify(err));
					// Error handling
					if (err) {
						req.session.flash = {
							err: 'Error revoking admin rights for user <strong>' + user.name + '</strong>.'
						};
						return res.redirect('/user');
					}
					req.session.flash = {
						msg: 'Successfully revoked admin rights for user <strong>' + user.name + '</strong>.'
					};
					return res.redirect('/user');
				});
		});
	}
};
