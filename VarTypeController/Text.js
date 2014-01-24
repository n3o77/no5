'use strict';

var prime = require('prime');
var Promise = require('promise')
var object = {
    'get': require('mout/object/get')
};

var Text = prime({

	constructor: function (varTypeTag, tplDesc) {
		this.varTypeTag = varTypeTag
		this.item = tplDesc
	},

	render: function() {
        return Promise.from(object.get(this.item.values, this.varTypeTag.key) || '');
	}

});

module.exports = Text