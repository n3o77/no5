'use strict';

var prime = require('prime')
var DC = require('../../DataController')
var Promise = require('promise')

var Test = prime({

    inherits: DC,

    constructor: function () {
        DC.apply(this, arguments)
    },

    parse: function() {
        return new Promise(function(resolve, reject) {
            this.values.test = new Date(1970, 0, 2)
            resolve()
        }.bind(this));
    }

})

module.exports = Test