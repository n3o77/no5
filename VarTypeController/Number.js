'use strict';

var prime = require('prime');
var Promise = require('promise');
var object = {
    'get': require('mout/object/get'),
    'merge': require('mout/object/merge')
}

var Number = prime({

    options: {
        'decimals': 0,
        'decPoint': '.',
        'thousandsSep': ','
    },

    constructor: function (varTypeTag, tplDesc, templateController, options) {
        this.options = object.merge(this.options, options)
        this.varTypeTag = varTypeTag
        this.item = tplDesc
    },

    render: function() {
        var value = object.get(this.item.values, this.varTypeTag.key);

        return Promise.from(this.format(value, this.varTypeTag.decimals, this.varTypeTag.decPoint, this.varTypeTag.thousandsSep));
    },

    format: function(number, decimals, decPoint, thousandsSep) {
        //code from: https://github.com/taijinlee/humanize
        decimals = isNaN(decimals) ? this.options.decimals : Math.abs(decimals);
        decPoint = (decPoint === undefined) ? this.options.decPoint : decPoint;
        thousandsSep = (thousandsSep === undefined) ? this.options.thousandsSep : thousandsSep;

        var sign = number < 0 ? '-' : '';
        number = Math.abs(+number || 0);

        var intPart = parseInt(number.toFixed(decimals), 10) + '';
        var j = intPart.length > 3 ? intPart.length % 3 : 0;

        return sign + (j ? intPart.substr(0, j) + thousandsSep : '') + intPart.substr(j).replace(/(\d{3})(?=\d)/g, '$1' + thousandsSep) + (decimals ? decPoint + Math.abs(number - intPart).toFixed(decimals).slice(2) : '');
    }

});

module.exports = Number