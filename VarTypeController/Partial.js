'use strict';

var prime = require('prime');
var item = require('../item')
var object = {
	'merge': require('mout/object/merge'),
}

var lang = {
    'deepClone': require('mout/lang/deepClone')
}

var Partial = prime({

	constructor: function (varTypeTag, item, tplController) {
		this.templateController = tplController
		this.varTypeTag = varTypeTag
		this.item = item
	},

	render: function() {
		var desc = lang.deepClone(this.item)
		var render = true;

		return this.templateController.parse(item(this.varTypeTag.tpl, desc, 0, render))
	}

});

module.exports = Partial