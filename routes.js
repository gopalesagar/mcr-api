module.exports = function(app) {
    var user = require('./controllers/userController');

    //USER MODULE
    app.post('/v1/users', user.signup);

};
