'use strict';

var prime = require('prime')
var item = require('../item')
var Promise = require('promise')

var UserList = prime({

	constructor: function (varTypeTag, tplDesc, tplController) {
		this.templateController = tplController
		this.varTypeTag = varTypeTag
		this.tplDesc = tplDesc
	},

	parse: function() {
		return new Promise(function(resolve, reject) {
			resolve({
				'listItems': [
					item('listItem', {'title': 'List Item 1'}),
					item('listItem', {'title': 'List Item 2'}),
					item('listItem', {'title': 'List Item 3'}),
					item('listItem', {'title': 'List Item 4'})
				]
			})
		}.bind(this));
	},

	renderPartial: function() {
		return new Promise(function(resolve, reject) {
			resolve((Date.now() % 2) === 1)
		}.bind(this));
	}

})

module.exports = UserList