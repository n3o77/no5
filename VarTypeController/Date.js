'use strict';

var prime = require('prime');
var Promise = require('promise');
var moment = require('moment');
var object = {
    'get': require('mout/object/get'),
    'merge': require('mout/object/merge')
};

var Date = prime({

    'options': {
        'format': 'YYYY-MM-DD'
    },

	constructor: function (varTypeTag, tplDesc, templateController, options) {
        this.options = object.merge(this.options, options)
		this.varTypeTag = varTypeTag
		this.item = tplDesc
        this.templateController = templateController
	},

	render: function() {
        var date = moment(object.get(this.item.values, this.varTypeTag.key));
        var format = this.varTypeTag.format || this.options.format;

        return Promise.from(date.format(format));
	}

});

module.exports = Date