'use strict';

var prime = require('prime');
var Promise = require('promise')
var all = Promise.all
var bItem = require('./item')
var isItem = require('./util/isItem')
var ENUM_MODE = require('./enums').ENUM_MODE

var array = {
    'forEach': require('mout/array/forEach'),
    'every': require('mout/array/every'),
    'find': require('mout/array/find')
}
var object = {
    'get': require('mout/object/get'),
    'map': require('mout/object/map'),
    'deepEquals': require('mout/object/deepEquals')
}
var lang = {
    'isString': require('mout/lang/isString'),
    'isObject': require('mout/lang/isObject'),
    'kindOf': require('mout/lang/kindOf'),
    'deepClone': require('mout/lang/deepClone')
}

var string = {
    'startsWith': require('mout/string/startsWith'),
    'trim': require('mout/string/trim')
}

var TemplateParser = prime({

    typeController: null,

    constructor: function (typeController, templateController, item) {
        this.typeController = typeController
        this.templateController = templateController
        this.item = item
        this.log = templateController.log
        this.mode = templateController.getConstants().mode
    },

    parse: function(tpl) {
        return new Promise(function(resolve, reject) {
            this.resolve = resolve
            this.reject = reject

            this.parseTemplate(tpl)
        }.bind(this))
    },

    parseTemplate: function(tpl) {
        if (!lang.isString(tpl)) this.log.error('Given Template is not a String: ' + tpl + ' ' + JSON.stringify(this.item))
        this.tpl = tpl
        var vars = this.getVars(tpl)
        if (vars.length === 0) return this.complete()
        var ps = []
        for (var i = 0; i < vars.length; i++) {
            var typeTag = vars[i];
            typeTag.template = this.item.template
            var jsonVars = typeTag.jsonVars
            var objVar = typeTag.typeTag
            var pos = typeTag.pos
            var origItem

            var DataControllerObj = this.templateController.getDataController(objVar.dc || objVar.dataController)
            if (DataControllerObj) {
                console.log(objVar.dc, DataControllerObj)
                if (this.mode === ENUM_MODE.DEBUG) origItem = lang.deepClone(this.item)
                var dataController = new DataControllerObj.controller(typeTag, this.item.values, this.templateController, DataControllerObj.options)
                ps.push(dataController.parse().then(this.initType.bind(this, typeTag, origItem)))
            } else {
                ps.push(this.initType(typeTag))
            }
        }

        return all(ps).then(this.complete.bind(this), this.reject)
    },

    initType: function(typeTag, origItem) {
        var objVar = typeTag.typeTag
        var jsonVars = typeTag.jsonVars

        if (this.mode === ENUM_MODE.DEBUG && origItem && !object.deepEquals(origItem, this.item)) this.log.debug('Item Changed from DataController. Orig: ', origItem, ' New:', this.item)
        var type = objVar.type = this.getType(objVar.type, object.get(this.item.values, objVar.key || ''))
        var TypeControllerObj = this.typeController[type]
        if (!TypeControllerObj) this.log.error('typeController "' + type + '" not available. From: ' + this.item.template + ':' + pos.line + ':' + pos.col)

        var options = object.map(TypeControllerObj.options, function(value) {
            if (string.startsWith(value, '__session')) return object.get(this.templateController.getSession(), value.replace(/^__session\./, ''))
            return value
        }, this)

        var typeController = new TypeControllerObj.controller(typeTag, this.item, this.templateController, options)
        return typeController.render().then(this.updateTemplate.bind(this, jsonVars, this.item))
    },

    complete: function() {
        var beginC = '', endC = ''
        if (this.mode === ENUM_MODE.DEVELOP) {
            var dcC = ''
            if (this.item.dc || this.item.dataController) dcC = 'DataController: ' + (this.item.dc || this.item.dataController)
            beginC = '<!-- START TEMPLATE: "' + this.item.template + '" ' + dcC + ' -->\n'
            endC = '\n<!-- END TEMPLATE: "' + this.item.template + '" ' + dcC + ' -->'
        }

        this.resolve(beginC + this.tpl + endC)
    },

    updateTemplate: function(jsonVars, item, result) {
        this.log.debug('Replacing typeTags (', jsonVars, ') with content:', result, 'item:', item)
        array.forEach(jsonVars, function(jsonVar) {
            var regex = new RegExp("\\$"+this.escapeVar(jsonVar), 'g')
            this.tpl = this.tpl.replace(regex, result)
        }, this)
    },

    escapeVar: function(jvar) {
        return jvar.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
    },

    getType: function(type, value) {
        if (type) return this.capitaliseFirstLetter(type)
        var result = 'Text'
        var kind = lang.kindOf(value);
        switch (kind) {
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
            case 'Object':
                result = 'Partial'
                break
            default:
                return 'Text'
        }

        if (!this.typeController[result]) {
            this.log.debug('Autocasting Value Type:', kind, ' Autocast to:', result, 'Value:', value)
            return 'Text'
        }
        this.log.debug('Autocasting Value Type:', kind, ' Autocast to:', result, 'Value:', value)
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

            this.addVarToResults(this.parseVar(varStr, lastPos), result)
        }
        return result
    },

    parseVar: function(jsonVar, pos) {
        var typeTag
        if (jsonVar.indexOf('{{') === 0) {
            var s = jsonVar.substring(2, jsonVar.length -2).split(',')
            typeTag = {'key': string.trim(s[0])}
            if (s[1]) typeTag.type = string.trim(s[1])
        } else {
            try {
                typeTag = JSON.parse(jsonVar.replace(/'/g, '"'))
            } catch (e) {
                this.log.error('ERROR WITH TYPE: ' + jsonVar + ' in Template: ' + this.item.template + ':' + pos.line + ':' + pos.col);
            }
        }

        if (!typeTag.key || string.trim(typeTag.key) === "") this.log.info('NO KEY SET IN TYPETAG: ' + jsonVar + ' in Template: ' + this.item.template + ':' + pos.line + ':' + pos.col)

        return {'typeTag': typeTag, 'pos': pos, 'jsonVars': [jsonVar]}
    },

    addVarToResults: function(parsed, result) {
        var vt = array.find(result, {'typeTag': parsed.typeTag});
        if (!vt) return result.push(parsed)
        if (!array.find(vt.jsonVars, {'jsonVars': parsed.jsonVars[0]})) vt.jsonVars.push(parsed.jsonVars[0])
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