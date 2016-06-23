module.exports = function(app) {
    var user = require('./controllers/userController');
    var auth = require('./controllers/authenticationController');
    var customer = require('./controllers/customerController');

    //USER MODULE
    app.get('/', function(req, res, next) {
        res.send(200, 'Welcome to MCR API')
    });

    app.post('/v1/users', user.save);
    app.post('/v1/auth', auth.authenticate);
    app.post('/v1/customers', customer.save);
};
