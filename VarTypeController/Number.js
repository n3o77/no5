'use strict';

var prime = require('prime');
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

    options: {
        'decimals': 0,
        'decPoint': '.',
        'thousandsSep': ',',
        'pad': 1,
        'padChar': null
    },

    constructor: function (varTypeTag, tplDesc, templateController, options) {
        this.options = object.merge(this.options, options)
        this.varTypeTag = varTypeTag
        this.item = tplDesc
    },

    render: function() {
        var value = object.get(this.item.values, this.varTypeTag.key)

        var decimals = this.varTypeTag.decimals || this.options.decimals
        var decimalPoint = this.varTypeTag.decPoint || this.options.decPoint
        var thousandsSeperator = this.varTypeTag.thousandsSep || this.options.thousandsSep

        var fNum = number.currencyFormat(value, decimals, decimalPoint, thousandsSeperator)

        if (this.varTypeTag.pad || this.options.pad) {
            var sNum = fNum.split(decimalPoint)
            sNum[0] = number.pad(sNum[0], this.varTypeTag.pad || this.options.pad, this.varTypeTag.padChar || this.options.padChar)
            fNum = sNum.join(decimalPoint)
        }

        return Promise.from(fNum);
    }

});

module.exports = Number