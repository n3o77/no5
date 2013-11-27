'use strict';

var prime = require('prime')
var TemplateParser = require('./TemplateParser')

var TemplateController = prime({

	'varTypeController': null,
	'viewController': null,

	constructor: function (templateLoader) {
		this.varTypeController = {}
		this.viewController = {}
		/** @type {TemplateLoader} */
		this.templateLoader = templateLoader
	},

	registerVarTypeController: function(name, controller) {
		this.varTypeController[name] = controller
	},

	registerViewController: function(name, controller) {
		this.viewController[name] = controller
	},

	getViewController: function(name) {
		if (this.viewController[name]) return this.viewController[name]
		return null
	},

	parse: function(item) {
		return this.getTemplateParser().parse(item)
	},

	getTemplateParser: function() {
		return new TemplateParser(this.templateLoader, this.varTypeController, this)
	}



});

module.exports = TemplateController