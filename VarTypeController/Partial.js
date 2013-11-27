'use strict';

var prime = require('prime');
var item = require('../item')

var Partial = prime({

	constructor: function (varTypeTag, tplDesc, tplController) {
		this.templateController = tplController
		this.varTypeTag = varTypeTag
		this.tplDesc = tplDesc
	},

	parse: function() {
		return this.templateController.getTemplateParser().parse(item(this.varTypeTag.tpl, this.tplDesc))
	}

});

module.exports = Partial