var db = require('../db');
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
function InvoiceController() {

    //REGISTERS A USER IN MULTPLYR
    this.save = function(req, res, next) {
        const tag = 'INVOICE SAVE: '
    	res.setHeader('Content-Type', 'application/json')
    	var customer = db.collection(collection.customers)
        var invoices = db.collection(collection.invoices)

        var customerId = req.body.customerId
        var invoiceDetails = req.body.invoiceDetails
        var invoiceAmount = req.body.invoiceAmount
        var invoiceDate = req.body.invoiceDate
        var status = req.body.status
        var payableDate = req.body.payableDate

        async.waterfall([
            function(callback) {
                //FIND CUSTOMER HERE
                var selector = {
                    _id: new ObjectId(customerId)
                }
                customers.find(selector).limit(1).toArray(function(error, _customers) {
                    if(error) {
                        log.e(tag + 'Error finding customer');
                        callback(mResponse.internalServerError, null)
                    } else {
                        if(_customers && _customers[0]) {
                            callback(null, _customers[0])
                        } else {
                            callback(mResponse.notFound, null)
                        }
                    }
                })
            },
            function(customer, callback) {
                var invoice = {
                    customer: customer,
                    invoiceDetails: invoiceDetails,
                    invoiceAmount: invoiceAmount,
                    invoiceDate: invoiceDate,
                    status: status.active,
                    payableDate: payableDate,
                    createdAt: new Date(),
                    updatedAt: new Date()
                }

                invoices.insert(invoice, insertOptions, function(error, response) {
                    if(error) {
                        log.e(tag + 'Error inserting invoice');
                        callback(mResponse.internalServerError, null)
                    } else {
                        callback(null, invoice)
                    }
                })
            }
        ], function(error, invoice) {
            if(error) {
                log.e(tag + 'Error inserting invoice final block');
                res.send(error.code, error);
            } else {
                res.send(mResponse.saveSuccess.code, mResponse.saveSuccess);
            }
        })
    };
    
    return this;
};

module.exports = new InvoiceController();
