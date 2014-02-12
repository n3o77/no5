'use strict';

var prime = require('prime')
var VTC = require('../TypeController')
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

    inherits: VTC,

    constructor: function () {
        VTC.apply(this, arguments)
    },

    render: function() {
        var value = object.get(this.item.values, this.typeTag.key);
        if (isItem(value)) return this.templateController.parse(value)
        if (!value && lang.isString(this.typeTag.tpl || this.typeTag.template)) return this.templateController.parse(bItem(this.typeTag.tpl, lang.deepClone(this.item.values), 0, true))

        return this.renderItems(value)
    },

    renderItems: function(items) {
        var ps = []
        if (!items) return Promise.from('')
        if (isItem(items)) return this.templateController.parse(items)
        if (!lang.isArray(items)) this.__log.error('Only type item or array is supported. You gave: ' + lang.kindOf(items) + ' ' + items)

        items.sort(function(a, b) {
            if (!a.pos && !b.pos) return 0
            if (!a.pos) return 1
            if (!b.pos) return -1
            return a.pos - b.pos
        })

        array.forEach(items, function(item, idx) {
            if (lang.isObject(item) && !isItem(item)) item = this.castObjectToItem(item, idx)
            if (lang.isString(item)) item = bItem(item, null, idx, true)
            if (isItem(item)) return ps.push(this.templateController.parse(item))
            ps.push(Promise.from(item))
        }, this)

        return all(ps).then(function(templates) {
            return templates.join('')
        })
    },

    castObjectToItem: function(obj, idx) {
        var tpl = this.typeTag.tpl || this.typeTag.template;
        if (tpl) return bItem(tpl, obj, idx)
        return obj
    }

})

module.exports = Partial