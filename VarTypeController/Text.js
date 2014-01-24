'use strict';

var prime = require('prime');
var Promise = require('promise')
var fromPath = require('../utils/fromPath');

var Text = prime({

	constructor: function (varTypeTag, tplDesc) {
		this.varTypeTag = varTypeTag
		this.item = tplDesc
	},

	render: function() {
        return Promise.from(fromPath(this.item.values, this.varTypeTag.name) || '');
	}

});

module.exports = Text