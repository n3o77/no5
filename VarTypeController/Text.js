'use strict';

var prime = require('prime');
var VTC = require('./VarTypeController')
var Promise = require('promise')
var lang = {
    'isString': require('mout/lang/isString')
}
var object = {
    'get': require('mout/object/get')
};

var Text = prime({

    inherits: VTC,

	constructor: function (varTypeTag, item, templateController, options) {
		this.varTypeTag = varTypeTag
		this.item = item
	},

	render: function() {
        var value = object.get(this.item.values, this.varTypeTag.key)
        if (!lang.isString(value)) value = JSON.stringify(value)

        return Promise.from(value || '');
	}

});

module.exports = Text