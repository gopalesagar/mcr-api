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
function CustomerController() {

    //REGISTERS A USER IN MULTPLYR
    this.save = function(req, res, next) {
        const tag = 'CUSTOMER SAVE: '
    	res.setHeader('Content-Type', 'application/json')
    	var customers = db.collection(collection.customers)

        var companyName = req.body.companyName
        var contactName = req.body.contactName
        var contactTitle = req.body.contactTitle
        var phone = req.body.phone
        var address = req.body.address
        var city = req.body.city
        var zipcode = req.body.zipcode
        var token = req.headers.token

        jwt.verify(token, config.authentication.superSecret, function(error, user) {
            if(error) {
                log.e(tag + JSON.stringify(error))
                res.send(mResponse.unauthorized.code, mResponse.unauthorized);
            } else {
                async.waterfall([
                    //SAVING CUSTOMER HERE
                    function(callback) {
                        var customer = {
                            companyName: companyName,
                            contactName: contactName,
                            contactTitle: contactTitle,
                            phone: phone,
                            address: address,
                            city: city,
                            zipcode: zipcode,
                            status: status.active,
                            createdAt: new Date(),
                            updatedAt: new Date()
                        }

                        customers.insert(customer, insertOptions, function(error, response) {
                            if(error) {
                                log.e(tag + 'Error inserting customer');
                                callback(mResponse.internalServerError, null)
                            } else {
                                callback(null, customer)
                            }
                        })
                    }
                ], function(error, customer) {
                    if(error) {
                        log.e(tag + 'Error inserting customer final block');
                        res.send(error.code, error);
                    } else {
                        res.send(mResponse.saveSuccess.code, mResponse.saveSuccess);
                    }
                })
            }
        });
    };

    this.list = function(req, res, next) {
        const tag = 'USER GET: '
        res.setHeader('Content-Type', 'application/json')
        var customers = db.collection(collection.customers)

        var skipCount = req.query.skipCount ? parseInt(req.query.skipCount) : 0
        var limit = req.query.limit ? parseInt(req.query.limit) : 0
        var token = req.headers.token

        jwt.verify(token, config.authentication.superSecret, function(error, user) {
            if(error) {
                log.e(tag + JSON.stringify(error))
                res.send(mResponse.unauthorized.code, mResponse.unauthorized);
            } else {

                async.waterfall([
                    function(callback) {
                        //FIND CUSTOMERS HERE
                        var selector = {}
                        customers.find(selector).limit(limit).skip(skipCount).toArray(function(error, _customers) {
                            if(error) {
                                log.e(tag + 'Error fetching customers');
                                callback(mResponse.internalServerError, null)
                            } else {
                                if(_customers && _customers.length > 0) {
                                    callback(null, _customers)
                                } else {
                                    callback(null, [])
                                }
                            }
                        })
                    }
                ], function(error, _customers) {
                    if(error) {
                        log.e(tag + 'Error fetching customers final block');
                        res.send(error.code, error);
                    } else {
                        //var response = {
                        //     users: _customers,
                        //     code: mResponse.querySuccess.code,
                        //     message: mResponse.querySuccess.message
                        // }
                        res.send(200, _customers);
                    }
                })
            }
        });
    };
    
    return this;
};

module.exports = new CustomerController();
