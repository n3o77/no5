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
		'tplSuffix': 'html',
        'cache': false
	},

    cache: null,

	constructor: function (conf) {
		this.config = object.mixIn(config, conf)
        this.cache = {}
	},

	loadTemplate: function(filePath) {
		return new Promise(function(resolve, reject) {
            var internalPath = __dirname + '/templates'
			var fallBack = path.normalize(internalPath + '/' + filePath + '.' + config.tplSuffix)
			filePath = path.normalize(config.templates + '/' + filePath + '.' + config.tplSuffix)
			if (!fs.existsSync(filePath) && fs.existsSync(fallBack)) filePath = fallBack

            if (this.config.cache && this.cache[filePath]) return resolve(this.cache[filePath])

			fs.readFile(filePath, 'utf-8', function(err, data) {
				if (err) return reject(err)

                if (this.config.cache) this.cache[filePath] = data

				resolve(data)
            }.bind(this))
		}.bind(this));
	}

});

module.exports = TemplateLoader