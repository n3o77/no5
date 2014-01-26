'use strict';

var prime = require('prime');
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

    'options': {
        'format': '%Y-%m-%d'
    },

	constructor: function (varTypeTag, item, templateController, options) {
        this.options = object.merge(this.options, options)
		this.varTypeTag = varTypeTag
		this.item = item
        this.templateController = templateController
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