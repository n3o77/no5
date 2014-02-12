'use strict';

var prime = require('prime')
var VTC = require('../../TypeController');
var Promise = require('promise')
var tplItem = require('../../item')
var Partial = require('./../Partial');

var lang = {
    'isArray': require('mout/lang/isArray'),
    'isObject': require('mout/lang/isObject')
}
var array = {
    'forEach': require('mout/array/forEach'),
    'map': require('mout/array/map'),
    'findIndex': require('mout/array/findIndex')
}
var object = {
    'forOwn': require('mout/object/forOwn'),
    'get': require('mout/object/get')
}

// Options
// key: selected elements
// options: available options, possible to group with object
// value: path to the options-value value
// tpl: template for the options

var Options = prime({

    inherits: VTC,

    constructor: function () {
        VTC.apply(this, arguments)
    },

    render: function() {
        var optionsSource = object.get(this.item.values, this.typeTag.options)
        var options

        if (lang.isArray(optionsSource)) {
            options = this.buildOptions(optionsSource)
        } else if (lang.isObject(optionsSource)) {
            options = this.buildOptions(this.generateOptionsFromObject(optionsSource))
        }

        var p = new Partial(this.objVar, this.item, this.templateController);
        return p.renderItems(options)
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
        var currentlySelected = object.get(this.item.values, this.typeTag.key)
        var tpl = this.typeTag.tpl ? object.get(this.item.values, this.typeTag.tpl) : 'form/option'

        return array.map(options, function(option, index) {
            option.selected = this.isValueOf(currentlySelected, this.typeTag.value, option.value) || option.value === currentlySelected
            return tplItem(tpl, option, index+1)
        }, this)
    },

    isValueOf: function(arr, path, value) {
        if (!lang.isArray(arr)) return false

        var idx = array.findIndex(arr, value)

        return idx > -1
    }
})

module.exports = Options