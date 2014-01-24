'use strict';

var prime = require('prime');
var Promise = require('promise')
var all = Promise.all

var TemplateParser = prime({

	varTypeController: null,

	constructor: function (varTypeController, templateController, item) {
		this.varTypeController = varTypeController
		this.templateController = templateController
        this.item = item
	},

	parse: function(tpl) {
		return new Promise(function(resolve, reject) {
			this.resolve = resolve
			this.reject = reject
            this.parseTemplate(tpl)
		}.bind(this))
	},

	parseTemplate: function(tpl) {
		this.tpl = tpl
		var vars = this.getVars(tpl)
		if (vars.length === 0) return this.resolve(tpl)
		var ps = []
		for (var i = 0; i < vars.length; i++) {
			var jsonVar = vars[i]
			try {
				var objVar = JSON.parse(jsonVar.replace(/'/g, '"'))
			} catch (e) {
				console.log('ERROR WITH VARTYPE: ', jsonVar);
			}

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
		var regex = new RegExp("\\$"+this.escapeVar(jsonVar), 'g')
		this.tpl = this.tpl.replace(regex, result)
	},

	escapeVar: function(jvar) {
	return jvar.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
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