'use strict';
var fs = require('fs')
var prime = require('prime')
var path = require('path')
var Promise = require('promise')
var config = require('./config')
var object = {
	'mixIn': require('prime/object/mixIn')
}

var TemplateLoader = prime({

	constructor: function (conf) {
		this.config = object.mixIn(config, conf)
	},

	loadTemplate: function(filePath, cb) {
		return new Promise(function(resolve, reject) {
			filePath = path.normalize(config.templates + '/' + filePath + '.' + config.tplSuffix)
			fs.readFile(filePath, 'utf-8', function(err, data) {
				if (err) return reject(err)
				resolve(data)
			})
		}.bind(this));
	}

});

module.exports = TemplateLoader