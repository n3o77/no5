'use strict';

var prime = require('prime')
var Promise = require('promise')

var Test = prime({

    constructor: function (varTypeTag, tplDesc, tplController) {
        this.templateController = tplController
        this.varTypeTag = varTypeTag
        this.item = tplDesc
    },

    parse: function() {
        return new Promise(function(resolve, reject) {
            this.item.values.test = new Date(1970, 0, 2)
            resolve()
        }.bind(this));
    }

})

module.exports = Test