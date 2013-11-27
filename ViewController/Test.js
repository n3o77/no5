'use strict';

var prime = require('prime');

var Test = prime({

	constructor: function (varTypeTag, tplDesc, tplController) {
		this.templateController = tplController
		this.varTypeTag = varTypeTag
		this.tplDesc = tplDesc
	},

	parse: function() {
		return {
			'test': 'ABC',
			'test2': 'def'
		}
	}

});

module.exports = Test