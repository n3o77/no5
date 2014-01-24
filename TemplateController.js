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
        if (!item.template) throw new Error('No Template Given')
        if (!item.render) return resolve('')

        return this.templateLoader.loadTemplate(item.template).then(this.getTemplateParser(item).parse.bind(this))
	},

	getTemplateParser: function(item) {
		return new TemplateParser(this.varTypeController, this, item)
	}

});

module.exports = TemplateController