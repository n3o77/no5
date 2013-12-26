'use strict';
var prime = require('prime')
var Promise = require('promise')
var object = {
	'mixIn': require('prime/object/mixIn')
}
var agent = require('agent');

var AjaxTemplateLoader = prime({

    config: null,
    cache: null,

	constructor: function (conf) {
		this.config = object.mixIn({}, this.config, conf);
        this.cache = {};
	},

	loadTemplate: function(filePath) {
        if (this.cache[filePath]) return Promise.from(this.cache[filePath]);
        return new Promise(function(resolve, reject) {
            agent(this.config.loaderUrl, {'template': filePath}, function(response) {
                this.cache[filePath] = response.body;
                return resolve(response.body);
            }.bind(this));
        }.bind(this));
	}
});

module.exports = AjaxTemplateLoader