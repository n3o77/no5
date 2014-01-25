'use strict';

var prime = require('prime');
var item = require('../item')
var object = {
	'merge': require('mout/object/merge'),
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
		var render = true;

		var ViewController = this.templateController.getViewController(this.varTypeTag.vc || this.varTypeTag.viewController)
		if (ViewController) {
			var viewController = new ViewController(this.varTypeTag, desc, this.templateController)
			return viewController.renderPartial().then(function(render) {
				if (render) return viewController.parse();
			}).then(function(vcDesc) {
				desc = object.merge(desc, vcDesc)
				return this.templateController.parse(item(this.varTypeTag.tpl, desc, 0, render))
			}.bind(this))
		}

		return this.templateController.parse(item(this.varTypeTag.tpl, desc, 0, render))
	}

});

module.exports = Partial