'use strict';

var prime = require('prime');
var Promise = require('promise')

var Partial = prime({

	constructor: function (varTypeTag, tplDesc) {
		this.varTypeTag = varTypeTag
		this.tplDesc = tplDesc
	},

	render: function() {
		return new Promise(function(resolve, reject) {
			resolve(this.tplDesc.values[this.varTypeTag.name] || '')
		}.bind(this))
	}

});

module.exports = Partial