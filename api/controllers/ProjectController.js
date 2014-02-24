/**
 * ProjectController
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
	 * (specific to ProjectController)
	 */
	_config: {},

	index: function(req, res, next) {
		Project.find(function getAllProjects(err, projects) {
			if (err) return next(err);
			res.view({
				title: "dW projects ",
				projects: projects
			});
		});
	},

	activate: function(req, res, next) {

		Project.findOne({
			id: req.param('id')
		}).done(function(err, project) {

			// Error handling
			if (err) {
				req.session.flash = {
					err: err
				};
				return next(err);
			}
			if (!project) {
				req.session.flash = {
					err: "Error activating project! Project doesn't exist"
				};
				return res.redirect('/project');
			}

			Project.update({
					id: req.param('id')
				}, {
					active: true
				},
				function(err) {
					// Error handling
					if (err) {
						req.session.flash = {
							err: 'Error activating app <strong>' + project.name + '</strong>.'
						};
						return res.redirect('/project');
					}
					req.session.flash = {
						msg: 'Successfully activated app <strong>' + project.name + '</strong>.'
					};
					return res.redirect('/project');
				});
		});

	},

	deactivate: function(req, res, next) {
		Project.findOne({
			id: req.param('id')
		}).done(function(err, project) {

			// Error handling
			if (err) {
				// Found multiple users!
				req.session.flash = {
					err: err
				};
				return next(err);

			}
			if (!project) {
				req.session.flash = {
					err: "Error activating project! Project doesn't exist"
				};
				return res.redirect('/project');
			}

			Project.update({
					id: req.param('id')
				}, {
					active: false
				},
				function(err) {
					// Error handling
					if (err) {
						req.session.flash = {
							err: 'Error disabling app <strong>' + project.name + '</strong>.'
						};
						return res.redirect('/project');
					}
					req.session.flash = {
						msg: 'Successfully disabled app <strong>' + project.name + '</strong>.'
					};
					return res.redirect('/project');
				});
		});
	}
};