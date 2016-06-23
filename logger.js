var path = require('path')
var winston = require('winston')
winston.emitErrs = true

var errorFilePath = path.join(__dirname, 'logs/' + ENV + '/mcr_error.log')
var errorFileMaxSize = 104857600
var maxErrorFiles = 10
var Levels = {
    Info: 'info',
    Error: 'error',
    Debug: 'debug'
}

var error = new winston.Logger({
    exitOnError: false,
    transports: [
        new winston.transports.File({
            level: Levels.Error,
            prettyPrint: true,
            filename: errorFilePath,
            handleExceptions: true,
            json: true,
            maxsize: errorFileMaxSize, //(in kbs)
            maxFiles: maxErrorFiles,
            colorize: true
        }),
        new winston.transports.Console({
            level: Levels.Error,
            prettyPrint: true,
            handleExceptions: true,
            json: false,
            colorize: true
        })
    ],
    exitOnError: false
})

var info = new winston.Logger({
    exitOnError: false,
    transports: [
        new winston.transports.Console({
            level: Levels.Info,
            prettyPrint: true,
            handleExceptions: true,
            json: false,
            colorize: true
        })
    ],
    exitOnError: false
})

var debug = new winston.Logger({
    exitOnError: false,
    transports: [
        new winston.transports.Console({
            level: Levels.Debug,
            prettyPrint: true,
            handleExceptions: true,
            json: false,
            colorize: true
        })
    ],
    exitOnError: false
})
var exports = {
    e: function(msg) {
        error.error(msg)
    },
    i: function(msg) {
        info.info(msg)
    },
    d: function(msg) {
        debug.debug(msg)
    }
}
//var wLogger = new winston.Logger(winstonOpts)

module.exports = exports
