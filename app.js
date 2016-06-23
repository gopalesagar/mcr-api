ENV = process.env.NODE_ENV
var fs = require('fs');
var path = require('path');
var restify = require('restify');
config = JSON.parse(fs.readFileSync(path.join(__dirname, 'config/' + ENV + '.json')));
mResponse = JSON.parse(fs.readFileSync(path.join(__dirname, 'utils/mcrApiResponse.json')));
collection = JSON.parse(fs.readFileSync(path.join(__dirname, 'utils/collections.json')));
status = JSON.parse(fs.readFileSync(path.join(__dirname, 'utils/status.json')));
ObjectId = require('mongodb').ObjectID

//REQUIRED TO LOG ACCESS LOGS TO FILE
var accessLogStream = fs.createWriteStream(path.join(__dirname, 'accessLogs/' + ENV + '/access.log'), {flags: 'a'})

var log = require('./logger');
var consoleLogger = require('morgan');

var app = restify.createServer({
	name: 'MCR API Server'
});

//REQUIRED TO LOG ACCESS LOGS TO FILE
// app.use(consoleLogger('combined', {
// 	immediate: true,
// 	stream: accessLogStream
// }))

//LOGS REQUEST TO CONSOLE
app.use(consoleLogger('combined', {
	immediate: true
}))

app.use(restify.bodyParser());
app.use(restify.queryParser());
app.use(restify.fullResponse());

app.listen(config.app.port, function() {
	log.i('MCR NodeJs server running on port ' + config.app.port);
});

var routes = require('./routes')(app);
