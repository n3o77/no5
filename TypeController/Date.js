'use strict';

var prime = require('prime');
var VTC = require('../TypeController')
var Promise = require('promise');
var lang = {
    'isDate': require('mout/lang/isDate'),
    'isString': require('mout/lang/isString')
}

var object = {
    'get': require('mout/object/get'),
    'merge': require('mout/object/merge')
};

var mDate = {
    'strftime': require('mout/date/strftime'),
    'parseIso': require('mout/date/parseIso')
}

var VTDate = prime({

    inherits: VTC,

    'options': {
        'format': '%Y-%m-%d'
    },

    constructor: function () {
        VTC.apply(this, arguments)
    },

    render: function() {
        var format = this.typeTag.format || this.options.format
        var value = object.get(this.item.values, this.typeTag.key)
        var locale = this.typeTag.locale

        if (locale && this.options.locales[locale]) locale = this.options.locales[locale]

        if (lang.isString(value)) value = new Date(mDate.parseIso(value))
        if (!lang.isDate(value)) {
            this.__error('Invalid Date: ' + value)
            return Promise.resolve('')
        }

        return Promise.resolve(mDate.strftime(value, format, locale))
    }

});

module.exports = VTDate