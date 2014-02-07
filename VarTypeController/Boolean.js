'use strict';

var prime = require('prime');
var VTC = require('../VarTypeController')
var Promise = require('promise')
var object = {
    'get': require('mout/object/get'),
    'merge': require('mout/object/merge')
};

var Boolean = prime({

    inherits: VTC,

    options: {
        "true": "true",
        "false": "false"
    },

    constructor: function () {
        VTC.apply(this, arguments)
    },

    render: function() {
        var t = this.varTypeTag['true'] || ""
        var f = this.varTypeTag['false'] || ""

        if (!this.varTypeTag['true'] && ! this.varTypeTag['false']) {
            t = this.options['true']
            f = this.options['false']
        }

        return Promise.from(object.get(this.item.values, this.varTypeTag.key) !== false ? t : f)
    }

});

module.exports = Boolean