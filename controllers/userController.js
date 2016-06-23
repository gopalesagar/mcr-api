var db = require('../db');
var crypto = require('crypto');
//var log = require('../logger');

//THIS CONTROLLER HANDLES ALL THE FUNCTIONALITIES RELATED TO USER
function UserController() {

    //REGISTERS A USER IN MULTPLYR
    this.signup = function(req, res, next) {

        var refreshToken = randomstring.generate({
    		length: 64,
    		readable: true
    	})

        res.send(mResponse.saveSuccess.code, mResponse.saveSuccess);
    };
    return this;
};

module.exports = new UserController();
