module.exports = {
	'/': function(req, res) {
		res.render('index');
	},
	'/chat': function(req, res) {
		res.render('chat');
	}
};
