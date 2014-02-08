'use strict';

var prime = require('prime');
var VTC = require('../VarTypeController')
var Promise = require('promise');
var object = {
    'get': require('mout/object/get'),
    'merge': require('mout/object/merge'),
    'filter': require('mout/object/filter'),
    'keys': require('mout/object/keys')
}

var number = {
    'currencyFormat': require('mout/number/currencyFormat'),
    'pad': require('mout/number/pad')
}

var Number = prime({

    inherits: VTC,
    options: {
        'decimals': 0,
        'decPoint': '.',
        'thousandsSep': ',',
        'pad': null,
        'padChar': null,
        'prefix': '',
        'suffix': ''
    },

    constructor: function () {
        VTC.apply(this, arguments)
    },

    render: function() {
        var value = object.get(this.item.values, this.varTypeTag.key)

        var opts = object.merge(this.options, object.filter(this.varTypeTag, function(val, key) {
            return object.keys(this.options).indexOf(key) !== -1
        }, this))
        var fNum = number.currencyFormat(value, opts.decimals, opts.decPoint, opts.thousandsSep)

        if (this.varTypeTag.pad || this.options.pad) {
            var sNum = fNum.split(opts.decPoint)
            sNum[0] = number.pad(sNum[0], this.varTypeTag.pad || this.options.pad, this.varTypeTag.padChar || this.options.padChar)
            fNum = sNum.join(opts.decPoint)
        }

        return Promise.from(opts.prefix.toString() + fNum.toString() + opts.suffix.toString());
    }

});

module.exports = Number