'use strict';
var prime = require('prime')
var Promise = require('promise')
var object = {
	'mixIn': require('prime/object/mixIn')
}
var agent = require('agent');

var AjaxTemplateLoader = prime({

	constructor: function (conf) {
		this.config = object.mixIn(config, conf)
	},

	loadTemplate: function(filePath) {
		return Promise.denodeify(agent)('get', {'template': filePath}, this.config.loaderUrl);
	}

});

module.exports = AjaxTemplateLoader