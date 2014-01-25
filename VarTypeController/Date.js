'use strict';

var prime = require('prime');
var Promise = require('promise');
var object = {
    'get': require('mout/object/get'),
    'merge': require('mout/object/merge')
};

var mDate = {
    "strftime": require('mout/date/strftime')
}

var Date = prime({

    'options': {
        'format': '%Y-%m-%d'
    },

	constructor: function (varTypeTag, tplDesc, templateController, options) {
        this.options = object.merge(this.options, options)
		this.varTypeTag = varTypeTag
		this.item = tplDesc
        this.templateController = templateController
	},

	render: function() {
        var format = this.varTypeTag.format || this.options.format;

        return Promise.from(mDate.strftime(object.get(this.item.values, this.varTypeTag.key), format));
	}

});

module.exports = Date