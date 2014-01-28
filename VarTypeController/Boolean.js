'use strict';

var prime = require('prime');
var VTC = require('./VarTypeController')
var Promise = require('promise')
var object = {
    'get': require('mout/object/get'),
    'merge': require('mout/object/merge')
};

var Boolean = prime({

    inherits: VTC,

    options: {
        "true": "true",
        "false": "false"
    },

	constructor: function (varTypeTag, item, templateController, options) {
        this.options = object.merge(this.options, options)
		this.varTypeTag = varTypeTag
		this.item = item
        this.templateController = templateController
	},

	render: function() {
        var t = this.varTypeTag['true'] || this.options['true']
        var f = this.varTypeTag['false'] || this.options['false']

        return Promise.from(object.get(this.item.values, this.varTypeTag.key) !== false ? t : f)
	}

});

module.exports = Boolean