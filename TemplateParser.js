'use strict';

var prime = require('prime');
var Promise = require('promise')
var all = Promise.all

var TemplateParser = prime({

	varTypeController: null,

	constructor: function (templateLoader, varTypeController, templateController) {
		this.templateLoader = templateLoader
		this.varTypeController = varTypeController
		this.templateController = templateController
	},

	parse: function(item) {
		if (!item.template) throw new Error('No Template Given')
		var ps = new Promise(function(resolve, reject) {
			if (!item.render) return resolve('')

			this.resolve = resolve
			this.reject = reject
		}.bind(this))
		this.item = item

		this.templateLoader.loadTemplate(item.template).then(this.parseTemplate.bind(this), this.reject).then(null, this.reject)

		return ps
	},

	parseTemplate: function(tpl) {
		this.tpl = tpl
		var vars = this.getVars(tpl)
		if (vars.length === 0) return this.resolve(tpl)
		var ps = []
		for (var i = 0; i < vars.length; i++) {
			var jsonVar = vars[i]
			var objVar = JSON.parse(jsonVar)
			var varType = this.getVarType(objVar.type)

			var VarTypeController = this.varTypeController[varType]
			if (!VarTypeController) throw new Error('varTypeController "' + varType + '" not available')

			var varTypeController = new VarTypeController(objVar, this.item, this.templateController)
			ps.push(varTypeController.render().then(this.updateTemplate.bind(this, jsonVar)))
		}

		return all(ps).then(function() {
			this.resolve(this.tpl)
		}.bind(this), this.reject)
	},

	updateTemplate: function(jsonVar, result) {
		var regex = new RegExp("\\$"+jsonVar, 'g')
		this.tpl = this.tpl.replace(regex, result)
	},

	getVarType: function(type) {
		if (!type) return 'Text'
		return this.capitaliseFirstLetter(type)
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
			var varStr = '{'+part.substring(0, pos)
			if (result.indexOf(varStr) === -1) result.push(varStr)
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

module.exports = TemplateParser