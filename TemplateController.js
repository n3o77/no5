'use strict';

var prime = require('prime')
var TemplateParser = require('./TemplateParser')

var TemplateController = prime({

	'varTypeController': null,

	constructor: function (templateLoader) {
		this.varTypeController = {}
		/** @type {TemplateLoader} */
		this.templateLoader = templateLoader
	},

	registerVarTypeController: function(name, controller) {
		this.varTypeController[name] = controller
	},

	parse: function(item) {
		return this.getTemplateParser().parse(item)
	},

	getTemplateParser: function() {
		return new TemplateParser(this.templateLoader, this.varTypeController, this)
	}



});

module.exports = TemplateController