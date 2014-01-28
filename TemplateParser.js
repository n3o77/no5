'use strict';

var prime = require('prime');
var Promise = require('promise')
var all = Promise.all
var bItem = require('./item')
var isItem = require('./util/isItem')

var array = {
    'every': require('mout/array/every'),
    'find': require('mout/array/find')
}
var object = {
    'get': require('mout/object/get'),
    'map': require('mout/object/map')
}
var lang = {
    'isString': require('mout/lang/isString'),
    'isObject': require('mout/lang/isObject'),
    'kindOf': require('mout/lang/kindOf')
}

var string = {
    'startsWith': require('mout/string/startsWith')
}

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
        if (!lang.isString(tpl)) throw error('Given Template is not a String: ' + tpl + ' ' + JSON.stringify(this.item))
		this.tpl = tpl
		var vars = this.getVars(tpl)
		if (vars.length === 0) return this.resolve(tpl)
		var ps = []
		for (var i = 0; i < vars.length; i++) {
            var tplVar = vars[i];
            var jsonVar = tplVar.jsonVar
            var objVar = tplVar.tplVar
            var pos = tplVar.pos

            var initVarType = function() {
                var varType = objVar.type = this.getVarType(objVar.type, object.get(this.item.values, objVar.key))
                var VarTypeControllerObj = this.varTypeController[varType]
                if (!VarTypeControllerObj) throw new Error('varTypeController "' + varType + '" not available. From: ' + this.item.template + ':' + pos.line + ':' + pos.col)

                var options = object.map(VarTypeControllerObj.options, function(value) {
                    if (string.startsWith(value, '__session')) return object.get(this.templateController.getSession(), value.replace(/^__session\./, ''))
                    return value
                }, this)

                var varTypeController = new VarTypeControllerObj.controller(tplVar, this.item, this.templateController, options)
                return varTypeController.render().then(this.updateTemplate.bind(this, jsonVar))
            }.bind(this)

            var ViewControllerObj = this.templateController.getViewController(objVar.vc || objVar.viewController)
            if (ViewControllerObj) {
                var viewController = new ViewControllerObj.controller(tplVar, this.item, this.templateController, ViewControllerObj.options)
                ps.push(viewController.parse().then(initVarType))
            } else {
                ps.push(initVarType())
            }
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

	getVarType: function(type, value) {
		if (type) return this.capitaliseFirstLetter(type)
        var result = 'Text'
        switch (lang.kindOf(value)) {
            case 'String':
                result = 'Text'
                break
            case 'Date':
                result = 'Date'
                break
            case 'Number':
                result = 'Number'
                break
            case 'Boolean':
                result = 'Boolean'
                break
            case 'Array':
                if (array.every(value, lang.isObject)) result = 'Partial'
                break
            case 'Object':
                if (isItem(value)) result = 'Partial'
                break
            default:
                return 'Text'
        }

        if (!this.varTypeController[result]) return 'Text'
        return result
	},

	capitaliseFirstLetter: function(string) {
		return string.charAt(0).toUpperCase() + string.slice(1);
	},

	getVars: function(source) {
		var result = []
		var bits = source.split("${")
        var lastPos = {'line': 1, 'col': 1}
		for (var i = 1; i < bits.length; i++) {
            lastPos = this.getStartPosition(bits[i-1], lastPos)
			var part = bits[i]
			var pos = this.findClosingBrace("{"+part)
			var varStr = '{'+part.substring(0, pos)
            var parsed = this.parseVar(varStr, lastPos)
			if (!array.find(parsed, {'jsonVar': varStr})) result.push(parsed)
		}
		return result
	},

    parseVar: function(jsonVar, pos) {
        var tplVar
        try {
            tplVar = JSON.parse(jsonVar.replace(/'/g, '"'))
        } catch (e) {
            throw new Error('ERROR WITH VARTYPE: ' + jsonVar + ' in Template: ' + this.item.template + ':' + pos.line + ':' + pos.col);
        }

        return {'tplVar': tplVar, 'pos': pos, 'jsonVar': jsonVar}
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
	},

    getStartPosition: function(bit, lastPos) {
        var m = bit.match(/\r?\n/g)
        var line = (m||[]).length
        var col = 0
        if (m && m.length > 0) {
            col = bit.length - bit.lastIndexOf(m[m.length - 1])
        } else {
            col = bit.length
        }
        if (line === 0) col += lastPos.col + 2

        return {'line': line + lastPos.line, 'col': col}
    }

});

module.exports = TemplateParser