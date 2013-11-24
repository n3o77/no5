'use strict';

var prime = require('prime')
var Promise = require('promise')

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
		if (!item.template) throw new Error('No Template Given')
		return this.templateLoader.loadTemplate(item.template).then(function(tpl) {
			return this.parseTemplate(tpl, item)
		}.bind(this))
	},

	parseTemplate: function(tpl, obj) {
		var vars = this.getVars(tpl)
		console.log('vars', vars)
		if (!vars) return resolve(tpl)

		for (var i = 0; i < vars.length; i++) {
			var jsonVar = vars[i]
			var objVar = JSON.parse(jsonVar)
			var VarTypeController = this.varTypeController[this.capitaliseFirstLetter(objVar.type)]
			if (!VarTypeController) throw new Error('varTypeController "' + objVar.type + '" not available')

			var varTypeController = new VarTypeController(objVar, obj)
			var value = varTypeController.parse();

			tpl = tpl.replace("$"+jsonVar, value);
		}

		return tpl
	},

	capitaliseFirstLetter: function(string) {
		return string.charAt(0).toUpperCase() + string.slice(1);
	},

	getVars: function(source) {
		var result = []
		var bits = source.split("${")
		for (var i = 1; i < bits.length; i++) {
			var part = bits[i]
			var pos = this.findClosingBrace("{"+part)
			result.push('{'+part.substring(0, pos))
		}
		return result
	},

	findClosingBrace: function(source) {
		var length = source.length
		var braceCount = 0
		for (var y = 0; y < length; y++) {
			if (source.charAt(y) == '{') {
				braceCount++
			}
			if (source.charAt(y) == '}') {
				if (braceCount == 1) {
					return y
				}

				braceCount--
			}
		}

		return -1;
	}



});

module.exports = TemplateController