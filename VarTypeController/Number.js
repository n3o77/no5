'use strict';

var prime = require('prime');
var Promise = require('promise');
var object = {
    'get': require('mout/object/get'),
    'merge': require('mout/object/merge')
}

var number = {
    'currencyFormat': require('mout/number/currencyFormat')
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

        return Promise.from(
            number.currencyFormat(
                value,
                this.varTypeTag.decimals || this.options.decimals,
                this.varTypeTag.decPoint || this.options.decPoint,
                this.varTypeTag.thousandsSep || this.options.thousandsSep
            )
        );
    }

});

module.exports = Number