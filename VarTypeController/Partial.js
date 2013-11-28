'use strict';

var prime = require('prime');
var item = require('../item')
var object = {
	'mixIn': require('prime/object/mixIn'),
	'create': require('prime/object/create')
}

var Partial = prime({

	constructor: function (varTypeTag, tplDesc, tplController) {
		this.templateController = tplController
		this.varTypeTag = varTypeTag
		this.tplDesc = tplDesc
	},

	render: function() {
		var desc = object.create(this.tplDesc)
		var render = true;
		var ViewController = this.templateController.getViewController(this.varTypeTag.vc || this.varTypeTag.viewController)
		if (ViewController) {
			var viewController = new ViewController(this.varTypeTag, desc, this.templateController)
			render = viewController.renderPartial()
			if (render) desc = object.mixIn(desc, viewController.parse())
		}
		return this.templateController.getTemplateParser().parse(item(this.varTypeTag.tpl, desc, 0, render))
	}

});

module.exports = Partial