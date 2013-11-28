'use strict';

var prime = require('prime')
var item = require('../item')

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
	},

	renderPartial: function() {
		return true
	}

})

module.exports = Test