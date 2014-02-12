'use strict';

var prime = require('prime')
var VC = require('../../DataController')

var Wrong = prime({

    inherits: VC,

    constructor: function () {
        VC.apply(this, arguments)
    }

})

module.exports = Wrong