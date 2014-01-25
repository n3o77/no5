'use strict';

var prime = require('prime')
var Promise = require('promise')
var typeOf = require('prime/type')
var tplItem = require('../../item')
var DynPartial = require('./../DynPartial');
var array = {
    'forEach': require('prime/array/forEach'),
    'map': require('prime/array/map')
}
var object = {
    'forOwn': require('prime/object/forOwn'),
    'mixIn': require('prime/object/mixIn'),
    'get': require('mout/object/get')
}

var Text = prime({

    constructor: function (varTypeTag, tplDesc, tplController) {
        this.templateController = tplController
        this.varTypeTag = varTypeTag
        this.item = tplDesc
    },

    render: function() {
        var options = object.get(this.item.values, this.varTypeTag.key)
        var tpl = object.get(this.item.values, this.varTypeTag.tpl)
        var values = {
            'options': []
        }

        if (typeOf(options) === 'object') {
            options = this.generateOptionsFromObject(options)
        }

        values.options = this.buildOptions(options)
        if (!this.varTypeTag.onlyOptions) {
            return this.templateController.getTemplateParser().parse(tplItem(tpl || 'input/select', object.mixIn({}, this.varTypeTag, values)))
        }

        var dp = new DynPartial(this.varTypeTag, this.item, this.templateController);
        return dp.renderItems(values.options);
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
        var value = object.get(this.item.values, this.varTypeTag.value)
        return array.map(options, function(option, index) {
            if (option.value === value) option.selected = 'selected'
            return tplItem('input/option', option, index)
        })
    }
})

module.exports = Text