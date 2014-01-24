'use strict';

var prime = require('prime')
var item = require('../item')
var array = {
	'forEach': require('prime/array/forEach')
}
var object = {
	'mixIn': require('prime/object/mixIn')
}
var Promise = require('promise')
var all = Promise.all
var fromPath = require('../utils/fromPath')

var DynPartial = prime({

	constructor: function (varTypeTag, tplDesc, tplController) {
		this.templateController = tplController
		this.varTypeTag = varTypeTag
		this.item = tplDesc
	},

	render: function() {
        return this.renderItems(fromPath(this.item.values, this.varTypeTag.name))
	},

    renderItems: function(items) {
        var ps = []
        if (!items || items.length === 0) return Promise.from('')

        items.sort(function(a, b) {
            return a.pos - b.pos
        })

        array.forEach(items, function(item) {
            ps.push(this.templateController.getTemplateParser().parse(item))
        }, this)

        return all(ps).then(function(templates) {
            return templates.join('')
        })
    }

})

module.exports = DynPartial