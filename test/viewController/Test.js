'use strict';

var prime = require('prime')
var VC = require('../../ViewController')
var Promise = require('promise')

var Test = prime({

    inherits: VC,

    constructor: function () {
        VC.apply(this, arguments)
    },

    parse: function() {
        return new Promise(function(resolve, reject) {
            this.item.values.test = new Date(1970, 0, 2)
            resolve()
        }.bind(this));
    }

})

module.exports = Test