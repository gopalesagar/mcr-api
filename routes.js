module.exports = function(app) {
    var user = require('./controllers/userController');
    var auth = require('./controllers/authenticationController');
    var customer = require('./controllers/customerController');

    //USER MODULE
    app.post('/v1/users', user.save);
    app.post('/v1/auth', auth.authenticate);
    app.post('/v1/customer', customer.save);
};
