'use strict';

var prime = require('prime');
var Promise = require('promise');
var moment = require('moment');
var fromPath = require('../utils/fromPath');

var Date = prime({

	constructor: function (varTypeTag, tplDesc, templateController) {
		this.varTypeTag = varTypeTag
		this.item = tplDesc
        this.templateController = templateController
	},

	render: function() {
        var date = moment(fromPath(this.item.values, this.varTypeTag.name));
        var format = this.varTypeTag.format || 'YYYY-MM-DD';

        return Promise.from(date.format(format));
	}

});

module.exports = Date