var crypto = require('crypto')
var async = require('async')
var jwt = require('jsonwebtoken')

var updateOptions = {
	new: true,
	w: 1
}

var insertOptions = {
	w: 1
}

var sort = []

function encrypt(text){
    var cipher = crypto.createCipher('aes-256-cbc','d6F3Efeq')
    var crypted = cipher.update(text,'utf8','hex')
    crypted += cipher.final('hex');
    return crypted;
}

function decrypt(text){
    var decipher = crypto.createDecipher('aes-256-cbc','d6F3Efeq')
    var dec = decipher.update(text,'hex','utf8')
    dec += decipher.final('utf8');
    return dec;
}

//THIS CONTROLLER HANDLES ALL THE FUNCTIONALITIES RELATED TO USER
function UserController() {

    //REGISTERS A USER IN MULTPLYR
    this.save = function(req, res, next) {
        const tag = 'USER SAVE: '
        res.setHeader('Content-Type', 'application/json')
        var users = db.collection(collection.users)
        
        var username = req.body.username
        var password = req.body.password
        
        async.waterfall([
            function(callback) {
                //FIND ANY EXISTING USER HERE
                var selector = {
                    username: username
                }
                users.find(selector).limit(1).toArray(function(error, _users) {
                    if(error) {
                        log.e(tag + 'Error fetching user');
                        callback(mResponse.internalServerError, null)
                    } else {
                        if(_users && _users[0]) {
                            callback(mResponse.duplicateUsername, null)
                        } else {
                            callback(null, null)
                        }
                    }
                })
            },
            function(user, callback) {
                var user = {
                    username: username,
                    password: encrypt(password),
                    status: status.active,
                    createdAt: new Date(),
                    updatedAt: new Date()
                }

                users.insert(user, insertOptions, function(error, response) {
                    if(error) {
                        log.e(tag + 'Error inserting user');
                        callback(mResponse.internalServerError, null)
                    } else {
                        callback(null, user)
                    }
                })
            }
        ], function(error, user) {
            if(error) {
                log.e(tag + 'Error inserting user final block');
                res.send(error.code, error);
            } else {
                res.send(mResponse.saveSuccess.code, mResponse.saveSuccess);
            }
        })
    };

    this.list = function(req, res, next) {
        const tag = 'USER GET: '
        res.setHeader('Content-Type', 'application/json')
        var users = db.collection(collection.users)
        var token = req.headers.token
        var skipCount = req.query.skipCount ? parseInt(req.query.skipCount) : 0
        var limit = req.query.limit ? parseInt(req.query.limit) : 0

        jwt.verify(token, config.authentication.superSecret, function(error, user) {
            if(error) {
                log.e(tag + JSON.stringify(error))
                res.send(mResponse.unauthorized.code, mResponse.unauthorized);
            } else {
                async.waterfall([
                    function(callback) {
                        //FIND USERS HERE
                        var selector = {}
                        users.find(selector).limit(limit).skip(skipCount).toArray(function(error, _users) {
                            if(error) {
                                log.e(tag + 'Error fetching user');
                                callback(mResponse.internalServerError, null)
                            } else {
                                if(_users && _users.length > 0) {
                                    callback(null, _users)
                                } else {
                                    callback(null, [])
                                }
                            }
                        })
                    }
                ], function(error, _users) {
                    if(error) {
                        log.e(tag + 'Error fetching users final block');
                        res.send(error.code, error);
                    } else {
                        // var response = {
                        //     users: _users,
                        //     code: mResponse.querySuccess.code,
                        //     message: mResponse.querySuccess.message
                        // }
                        res.send(200, _users);
                    }
                })
            }
        })
    };
    return this;
};

module.exports = new UserController();
