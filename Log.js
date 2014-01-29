'use strict';

var prime = require('prime');

var ENUM_LEVEL = {
    'QUIET': 'quiet',
    'DEBUG': 'debug',
    'INFO': 'info',
    'WARN': 'warn',
    'ERROR': 'error'
}

var Log = prime({

    level: ENUM_LEVEL.QUIET,

    constructor: function (level, logger, throwError) {
        if (level) this.level = level
        this.logger = logger
        this.throwError = throwError
    },

    log: function(level, message) {
        if (ENUM_LEVEL.ERROR === level && this.throwError) throw new Error(message)
        if (!this.logger) return
        switch (this.level) {
            case ENUM_LEVEL.QUIET:
                break;
            case ENUM_LEVEL.ERROR:
                if (level == ENUM_LEVEL.WARN) break
            case ENUM_LEVEL.WARN:
                if (level == ENUM_LEVEL.INFO) break;
            case ENUM_LEVEL.INFO:
                if (level == ENUM_LEVEL.DEBUG) break;
            case ENUM_LEVEL.DEBUG:
            default:
                this.logger.apply(this.logger, Array.prototype.slice.call(arguments))
        }
    },

    debug: function() {
        var args = Array.prototype.slice.call(arguments)
        args.unshift(ENUM_LEVEL.DEBUG)
        this.log.apply(this, args)
    },

    info: function() {
        var args = Array.prototype.slice.call(arguments)
        args.unshift(ENUM_LEVEL.INFO)
        this.log.apply(this, args)
    },

    warn: function() {
        var args = Array.prototype.slice.call(arguments)
        args.unshift(ENUM_LEVEL.WARN)
        this.log.apply(this, args)
    },

    error: function() {
        var args = Array.prototype.slice.call(arguments)
        args.unshift(ENUM_LEVEL.ERROR)
        this.log.apply(this, args)
    },

    ENUM_LEVEL: ENUM_LEVEL

})


module.exports = Log