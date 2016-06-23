var async = require('async')
var fs = require('fs')
var path = require('path')

var mongodb = require('mongodb')
var MongoClient = mongodb.MongoClient
var _conf
var connectionString
var database

exports.init = function(params) {
	var mongodb = require('mongodb')
	var MongoClient = mongodb.MongoClient
	if(MongoClient) {
		MongoClient.connect(config.db.connectionString, config.db.options, function(err, database) {
			if(err) {
				log.e(err)
				params.error(err)
			} else {
				var mongoResponse = {
					db: database
				}
				params.success(mongoResponse)
			}
		})
	} else {
		log.e('Module mongodb not found')
		params.error('Module mongodb not found')
	}
}
