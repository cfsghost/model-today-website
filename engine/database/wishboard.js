"use strict";

var DBHouse = require('dbhouse');

var dbHouse = new DBHouse();
var db = null;

// Define schema
var wishboardDatabaseSchema = new DBHouse.Schema({
	_id: { type: 'UUID' },
	name: { type: 'String' },
	email: { type: 'String' },
	msg: { type: 'String' },
	created: { type: 'Date' }
});

// Index
var wishboardDatabaseIndex = new DBHouse.Index([
    { fields: [ 'name' ] },
    { fields: [ 'email' ] },
    { fields: [ 'created' ] }
]);

// Connect to database
dbHouse.connect('mongodb', { host: 'localhost', port: 27017 }, function() {

	db = new DBHouse.Database(dbHouse);

	// Create Index
    db.open('pei')
		.collection('wishbaord')
		.model(wishboardDatabaseSchema, wishboardDatabaseIndex)
		.createIndex();
});

module.exports = {
	connection: dbHouse,
	db: db,
	schema: wishboardDatabaseSchema,
	index: wishboardDatabaseIndex
};
