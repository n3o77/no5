'use strict';

var prime = require('prime');
var VTC = require('../VarTypeController')
var Promise = require('promise');
var object = {
    'get': require('mout/object/get'),
    'merge': require('mout/object/merge')
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

        var decimals = this.varTypeTag.decimals || this.options.decimals
        var decimalPoint = this.varTypeTag.decPoint || this.options.decPoint
        var thousandsSeperator = this.varTypeTag.thousandsSep || this.options.thousandsSep
        var prefix = this.varTypeTag.prefix || this.options.prefix
        var suffix = this.varTypeTag.suffix || this.options.suffix

        var fNum = number.currencyFormat(value, decimals, decimalPoint, thousandsSeperator)

        if (this.varTypeTag.pad || this.options.pad) {
            var sNum = fNum.split(decimalPoint)
            sNum[0] = number.pad(sNum[0], this.varTypeTag.pad || this.options.pad, this.varTypeTag.padChar || this.options.padChar)
            fNum = sNum.join(decimalPoint)
        }

        return Promise.from(prefix.toString() + fNum.toString() + suffix.toString());
    }

});

module.exports = Number