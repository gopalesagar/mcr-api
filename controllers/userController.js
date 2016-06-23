var crypto = require('crypto')
var async = require('async')

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
    return this;
};

module.exports = new UserController();
