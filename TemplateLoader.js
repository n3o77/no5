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

	config: {
		'templates': null,
		'tplSuffix': 'html'
	},

	constructor: function (conf) {
		this.internalPath = __dirname + '/templates'
		this.config = object.mixIn(config, conf)
	},

	loadTemplate: function(filePath) {
		return new Promise(function(resolve, reject) {
			var fallBack = path.normalize(this.internalPath + '/' + filePath + '.' + config.tplSuffix)
			filePath = path.normalize(config.templates + '/' + filePath + '.' + config.tplSuffix)
			if (!fs.existsSync(filePath) && fs.existsSync(fallBack)) filePath = fallBack

			fs.readFile(filePath, 'utf-8', function(err, data) {
				if (err) return reject(err)
				resolve(data)
			})
		}.bind(this));
	}

});

module.exports = TemplateLoader