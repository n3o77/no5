'use strict';

var prime = require('prime')
var item = require('../item')
var isItem = require('../util/isItem')
var lang = {
    'isObject': require('mout/lang/isObject')
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

var DynPartial = prime({

	constructor: function (varTypeTag, tplDesc, tplController) {
		this.templateController = tplController
		this.varTypeTag = varTypeTag
		this.item = tplDesc
	},

	render: function() {
        return this.renderItems(object.get(this.item.values, this.varTypeTag.key))
	},

    renderItems: function(items) {
        var ps = []
        if (!items || items.length === 0) return Promise.from('')

        if (array.every(items, lang.isObject) && !array.every(items, isItem)) {
            items = this.castObjectsToItems(items)
        } else if (!array.every(items, isItem)) {
            throw new Error('Array Contains non items')
        }

        items.sort(function(a, b) {
            return a.pos - b.pos
        })

        array.forEach(items, function(item) {
            ps.push(this.templateController.parse(item))
        }, this)

        return all(ps).then(function(templates) {
            return templates.join('')
        })
    },

    castObjectsToItems: function(items) {
        var cast = []
        var i = 0
        array.forEach(items, function(obj) {
            object.forOwn(obj, function(value, key) {
                cast.push(item(key, value, i++))
            })
        })

        return cast
    }

})

module.exports = DynPartial