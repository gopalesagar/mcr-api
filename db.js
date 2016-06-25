var mongodb = require('mongodb');
var fs = require('fs');
var path = require('path');
var restify = require('restify');
var log = require('./logger');
var exports = {};

var MongoClient = mongodb.MongoClient;

var connectionString = process.env.MONGODB_URI || config.db.connectionString

log.d('This is the connection string ' + connectionString);

if(MongoClient) {
	MongoClient.connect(connectionString, config.db.options, function(error, db) {
		if(error) {
			log.e(__filename + JSON.stringify(error));
		} else {
			log.i('Database initialized!')
			GLOBAL.db = db;
		}
	})
}

module.exports = exports;
