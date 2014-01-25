'use strict';

var prime = require('prime');
var Promise = require('promise')
var object = {
    'get': require('mout/object/get'),
    'merge': require('mout/object/merge')
};

var Boolean = prime({

    options: {
        "true": "true",
        "false": "false"
    },

	constructor: function (varTypeTag, tplDesc, templateController, options) {
        this.options = object.merge(this.options, options)
		this.varTypeTag = varTypeTag
		this.item = tplDesc
        this.templateController = templateController
	},

	render: function() {
        var t = this.varTypeTag['true'] || this.options['true']
        var f = this.varTypeTag['false'] || this.options['false']

        return Promise.from(object.get(this.item.values, this.varTypeTag.key) !== false ? t : f)
	}

});

module.exports = Boolean