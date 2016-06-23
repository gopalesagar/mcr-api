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
function AuthenticationController() {

    //REGISTERS A USER IN MULTPLYR
    this.authenticate = function(req, res, next) {
        const tag = 'AUTHENTICATE: '
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
                            callback(_users[0], null)
                        } else {
                            callback(mResponse.invalidLogin, null)
                        }
                    }
                })
            },
            function(user, callback) {
                var decryptedPassword = decrypt(hashedPassword)
                if(password === decryptedPassword) {
                    callback(null, user)
                } else {
                    callback(mResponse.invalidLogin, null)
                }
            }
        ], function(error, user) {
            if(error) {
                log.e(tag + 'Error authenticating user final block');
                res.send(error.code, error);
            } else {
                var response = {
                    code: mResponse.saveSuccess.code,
                    body: mResponse.saveSuccess,
                    user: user
                }
                res.send(response.code, response);
            }
        })
    };

    return this;
};

module.exports = new AuthenticationController();
