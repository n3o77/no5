'use strict';

var prime = require('prime')
var item = require('../item')
var Promise = require('promise')

var Test = prime({

	constructor: function (varTypeTag, tplDesc, tplController) {
		this.templateController = tplController
		this.varTypeTag = varTypeTag
		this.tplDesc = tplDesc
	},

	parse: function() {
		return new Promise(function(resolve, reject) {
			resolve({
				'test': 'ABC',
				'test2': 'def'
			})
		}.bind(this));
	},

	renderPartial: function() {
		return new Promise(function(resolve, reject) {
			resolve(true)
		}.bind(this));
	}

})

module.exports = Test