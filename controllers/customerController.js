var crypto = require('crypto');

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
    	var customer = db.collection(collection.customers)

        var companyName = req.body.companyName
        var contactName = req.body.contactName
        var contactTitle = req.body.contactTitle
        var phone = req.body.phone
        var address = req.body.address
        var city = req.body.city
        var zipcode = req.body.zipcode

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
    };
    return this;
};

module.exports = new CustomerController();
