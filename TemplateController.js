'use strict';

var Promise = require('promise')
var prime = require('prime')
var TemplateParser = require('./TemplateParser')
var lang = {
    'deepClone': require('mout/lang/deepClone')
}

var TemplateController = prime({

	'varTypeController': null,
	'viewController': null,
    'session': null,
    'constants': null,

	constructor: function (templateLoader, constants) {
        /** @type {TemplateLoader} */
        this.templateLoader = templateLoader
        this.constants = constants

        this.varTypeController = {}
		this.viewController = {}
	},

    setSession: function(session) {
        this.session = session
    },

    getSession: function() {
        return this.session || {}
    },

    getConstants: function() {
        return lang.deepClone(this.constants || {})
    },

	registerVarTypeController: function(name, controller, options) {
		this.varTypeController[name] = {'controller': controller, 'options': options}
	},

	registerViewController: function(name, controller, options) {
		this.viewController[name] = {'controller': controller, 'options': options}
	},

	getViewController: function(name) {
		if (this.viewController[name]) return this.viewController[name]
		return null
	},

	parse: function(item) {
        if (!item.template) throw new Error('No Template Given')
        if (!item.render) return Promise.from('')

        return this.templateLoader.loadTemplate(item.template).then(function(tpl) {
            var tplParser = this.getTemplateParser(item)
            return tplParser.parse(tpl)
        }.bind(this))
	},

	getTemplateParser: function(item) {
		return new TemplateParser(this.varTypeController, this, item)
	}

});

module.exports = TemplateController