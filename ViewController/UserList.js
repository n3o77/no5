'use strict';

var prime = require('prime')
var item = require('../item')

var UserList = prime({

	constructor: function (varTypeTag, tplDesc, tplController) {
		this.templateController = tplController
		this.varTypeTag = varTypeTag
		this.tplDesc = tplDesc
	},

	parse: function() {
		return {
			'listItems': [
				item('listItem', {'title': 'List Item 1'}),
				item('listItem', {'title': 'List Item 2'}),
				item('listItem', {'title': 'List Item 3'}),
				item('listItem', {'title': 'List Item 4'})
			]
		}
	},

	renderPartial: function() {
		return (Date.now() % 2) === 1
	}

})

module.exports = UserList