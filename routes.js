module.exports = function(app) {
    var user = require('./controllers/userController');
    var auth = require('./controllers/authenticationController');
    var customer = require('./controllers/customerController');
    var invoice = require('./controllers/invoiceController');

    //USER MODULE
    app.get('/', function(req, res, next) {
        res.send(200, 'Welcome to MCR API')
    });

    //AUTHENTICATION OF USERS
    app.post('/v1/auth', auth.authenticate);
    
    //USER MODULE
    app.post('/v1/users', user.save);
    app.get('/v1/users', user.list);

    //CUSTOMER MODULE
    app.post('/v1/customers', customer.save);
    app.get('/v1/customers', customer.list);
    
    //INVOICE MODULE
    app.post('/v1/invoices', invoice.save);
    app.get('/v1/invoices', invoice.list);
};
