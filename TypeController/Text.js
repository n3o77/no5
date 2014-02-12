'use strict';

var prime = require('prime');
var VTC = require('../TypeController')
var Promise = require('promise')
var lang = {
    'isString': require('mout/lang/isString')
}
var object = {
    'get': require('mout/object/get')
};

var Text = prime({

    inherits: VTC,

    constructor: function () {
        VTC.apply(this, arguments)
    },

    render: function() {
        var value = object.get(this.item.values, this.typeTag.key)
        if (!lang.isString(value)) value = JSON.stringify(value)

        return Promise.from(value || '');
    }

});

module.exports = Text