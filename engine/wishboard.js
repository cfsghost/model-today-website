"use strict";

var wishboardDB = require('./database/wishboard.js');

var WishBoard = function() {
	var self = this;
};

WishBoard.prototype.wish = function(msg, callback) {
	var self = this;

	if (!msg.msg) {
		callback(null);
		return;
	}

	wishboardDB.db.open('pei')
		.collection('wishboard')
		.model(wishboardDB.schema)
		.insert({
			name: msg.name || 'Anonymous',
			email: msg.email || '',
			msg: msg.msg,
			created: new Date().getTime()
		}, function(err, row) {

			if (err) {
				callback(err);
				return;
			}

			callback(null, row);
		});
};

WishBoard.prototype.getWishMsg = function(offset, limit, callback) {
	var self = this;

	wishboardDB.db.open('pei')
		.collection('wishboard')
		.model(wishboardDB.schema)
		.order('created', -1)
		.skip(offset)
		.limit(limit)
		.query(function(err, rows) {

			if (err) {
				callback(new Error('There is problem happened to wishboard database'));
				return;
			}

			callback(null, rows);
			
		});
};

WishBoard.prototype.messageCount = function(callback) {
	var self = this;

	wishboardDB.db.open('pei')
		.collection('wishboard')
		.model(wishboardDB.schema)
		.count(function(err, num) {
			callback(null, num);
		});
};


module.exports = {
	type: 'engine',
	engine_name: 'WishBoard',
	prototype: WishBoard
};
