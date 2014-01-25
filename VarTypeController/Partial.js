'use strict';

var prime = require('prime')
var bItem = require('../item')
var isItem = require('../util/isItem')
var lang = {
    'isObject': require('mout/lang/isObject'),
    'isArray': require('mout/lang/isArray'),
    'isString': require('mout/lang/isString'),
    'kindOf': require('mout/lang/kindOf'),
    'deepClone': require('mout/lang/deepClone')
}
var array = {
	'forEach': require('mout/array/forEach'),
    'every': require('mout/array/every')
}
var object = {
    'get': require('mout/object/get'),
    'forOwn': require('mout/object/forOwn')
}

var Promise = require('promise')
var all = Promise.all

var Partial = prime({

	constructor: function (varTypeTag, item, tplController) {
		this.templateController = tplController
		this.varTypeTag = varTypeTag
		this.item = item
	},

	render: function() {
        var value = object.get(this.item.values, this.varTypeTag.key);
        if (isItem(value)) return this.templateController.parse(value)
        if (!value && lang.isString(this.varTypeTag.tpl || this.varTypeTag.template)) return this.templateController.parse(bItem(this.varTypeTag.tpl, lang.deepClone(this.item), 0, true))

        return this.renderItems(value)
	},

    renderItems: function(items) {
        var ps = []
        if (!items) return Promise.from('')
        if (isItem(items)) return this.templateController.parse(items)
        if (!lang.isArray(items)) throw new Error('Only type item or array is supported. You gave: ' + lang.kindOf(items) + ' ' + items)

        items.sort(function(a, b) {
            if (!a.pos && !b.pos) return 0
            if (!a.pos) return 1
            if (!b.pos) return -1
            return a.pos - b.pos
        })

        array.forEach(items, function(item, idx) {
            if (lang.isObject(item) && !isItem(item)) item = this.castObjectToItem(item, idx)
            if (lang.isString(item)) item = bItem(item, lang.deepClone(this.item), idx, true)
            ps.push(this.templateController.parse(item))
        }, this)

        return all(ps).then(function(templates) {
            return templates.join('')
        })
    },

    castObjectToItem: function(obj, idx) {
        var cast
        object.forOwn(obj, function(value, key) {
            cast = bItem(key, value, idx)
        })

        return cast
    }

})

module.exports = Partial