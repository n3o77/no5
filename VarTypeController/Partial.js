'use strict';

var prime = require('prime');
var item = require('../item')
var isItem = require('../util/isItem')
var object = {
	'merge': require('mout/object/merge'),
    'get': require('mout/object/get')
}

var lang = {
    'deepClone': require('mout/lang/deepClone')
}

var Partial = prime({

	constructor: function (varTypeTag, item, tplController) {
		this.templateController = tplController
		this.varTypeTag = varTypeTag
		this.item = item
	},

	render: function() {
		var desc = lang.deepClone(this.item)
        var value = object.get(this.item.values, this.varTypeTag.key)

        if (isItem(value)) return this.templateController.parse(value)

		return this.templateController.parse(item(this.varTypeTag.tpl, desc, 0, true))
	}

});

module.exports = Partial