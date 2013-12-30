'use strict';

var prime = require('prime')
var Promise = require('promise')
var fromPath = require('../utils/fromPath')
var typeOf = require('prime/type')
var tplItem = require('../item')
var array = {
    'forEach': require('prime/array/forEach'),
    'map': require('prime/array/map')
}
var object = {
    'forOwn': require('prime/object/forOwn'),
    'mixIn': require('prime/object/mixIn')
}


var Text = prime({

    constructor: function (varTypeTag, tplDesc, tplController) {
        this.templateController = tplController
        this.varTypeTag = varTypeTag
        this.tplDesc = tplDesc
    },

    render: function() {
        var options = fromPath(this.tplDesc.values, this.varTypeTag.name)
        var tpl = fromPath(this.tplDesc.values, this.varTypeTag.tpl)
        var values = {
            'options': []
        }

        if (typeOf(options) === 'object') {
            options = this.generateOptionsFromObject(options)
        }

        values.options = this.buildOptions(options)
        return this.templateController.getTemplateParser().parse(tplItem(tpl || 'input/select', object.mixIn({}, this.varTypeTag, values)))
    },

    generateOptionsFromObject: function(options) {
        var opts = []
        object.forOwn(options, function(value, key) {
            opts.push({'value': key, 'label': value})
        })

        return opts
    },

    buildOptions: function(options) {
        if (!options) return []
        var value = fromPath(this.tplDesc.values, this.varTypeTag.value)
        return array.map(options, function(option, index) {
            if (option.value === value) option.selected = 'selected'
            return tplItem('input/option', option, index)
        })
    }
})

module.exports = Text