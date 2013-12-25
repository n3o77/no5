'use strict';

var prime = require('prime');
var Promise = require('promise');
var fromPath = require('../utils/fromPath');

var Number = prime({

    constructor: function (varTypeTag, tplDesc) {
        this.varTypeTag = varTypeTag
        this.tplDesc = tplDesc
    },

    render: function() {
        var value = fromPath(this.tplDesc.values, this.varTypeTag.name);

        return Promise.from(this.format(value, this.varTypeTag.decimals, this.varTypeTag.decPoint, this.varTypeTag.thousandsSep));
    },

    format: function(number, decimals, decPoint, thousandsSep) {
        //code from: https://github.com/taijinlee/humanize
        decimals = isNaN(decimals) ? 2 : Math.abs(decimals);
        decPoint = (decPoint === undefined) ? ',' : decPoint;
        thousandsSep = (thousandsSep === undefined) ? '.' : thousandsSep;

        var sign = number < 0 ? '-' : '';
        number = Math.abs(+number || 0);

        var intPart = parseInt(number.toFixed(decimals), 10) + '';
        var j = intPart.length > 3 ? intPart.length % 3 : 0;

        return sign + (j ? intPart.substr(0, j) + thousandsSep : '') + intPart.substr(j).replace(/(\d{3})(?=\d)/g, '$1' + thousandsSep) + (decimals ? decPoint + Math.abs(number - intPart).toFixed(decimals).slice(2) : '');
    }

});

module.exports = Number