'use strict';

var prime = require('prime');
var Promise = require('promise')
var fromPath = require('../utils/fromPath');

var Text = prime({

	constructor: function (varTypeTag, tplDesc) {
		this.varTypeTag = varTypeTag
		this.tplDesc = tplDesc
	},

	render: function() {
        return Promise.from(fromPath(this.tplDesc.values, this.varTypeTag.name) || '');
	}

});

module.exports = Text