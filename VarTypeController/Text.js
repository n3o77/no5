'use strict';

var prime = require('prime');
var Promise = require('promise')

var Partial = prime({

	constructor: function (varTypeTag, tplDesc) {
		this.varTypeTag = varTypeTag
		this.tplDesc = tplDesc
	},

	render: function() {
        return Promise.from(this.tplDesc.values[this.varTypeTag.name] || '');
	}

});

module.exports = Partial