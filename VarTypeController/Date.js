'use strict';

var prime = require('prime');
var VTC = require('./VarTypeController')
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
        var format = this.varTypeTag.format || this.options.format
        var value = object.get(this.item.values, this.varTypeTag.key)

        if (lang.isString(value)) value = new Date(mDate.parseIso(value))
        if (!lang.isDate(value)) throw new Error('Invalid Date: ' + value)

        return Promise.from(mDate.strftime(value, format))
	}

});

module.exports = VTDate