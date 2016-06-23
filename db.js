var mongodb = require('mongodb');
var fs = require('fs');
var path = require('path');
var restify = require('restify');
var log = require('./logger');
var exports = {};

var MongoClient = mongodb.MongoClient;

if(MongoClient) {
	MongoClient.connect(config.db.connectionString, config.db.options, function(error, db) {
		if(error) {
			log.e(__filename + JSON.stringify(error));
		} else {
			exports.db = db;
		}
	})
}

module.exports = exports;
