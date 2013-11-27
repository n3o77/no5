'use strict';

var prime = require('prime');
var item = require('../item')
var object = {
	'mixIn': require('prime/object/mixIn')
}

var Partial = prime({

	constructor: function (varTypeTag, tplDesc, tplController) {
		this.templateController = tplController
		this.varTypeTag = varTypeTag
		this.tplDesc = tplDesc
	},

	render: function() {
		var desc = this.tplDesc
		var ViewController = this.templateController.getViewController(this.varTypeTag.vc || this.varTypeTag.viewController)
		if (ViewController) {
			var viewController = new ViewController(this.varTypeTag, desc, this.templateController)
			object.mixIn(desc, viewController.parse())
		}
		return this.templateController.getTemplateParser().parse(item(this.varTypeTag.tpl, desc))
	}

});

module.exports = Partial