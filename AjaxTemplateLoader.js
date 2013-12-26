'use strict';
var prime = require('prime')
var Promise = require('promise')
var object = {
	'mixIn': require('prime/object/mixIn')
}
var agent = require('agent');

var AjaxTemplateLoader = prime({

    config: {},

	constructor: function (conf) {
		this.config = object.mixIn(this.config, conf)
	},

	loadTemplate: function(filePath) {
        return new Promise(function(resolve, reject) {
            agent('GET', this.config.loaderUrl, {'template': filePath}, function(response) {
                return resolve(response.body);
            });
        }.bind(this));
	}
});

module.exports = AjaxTemplateLoader