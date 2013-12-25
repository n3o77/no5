'use strict';

var prime = require('prime');
var Promise = require('promise');
var moment = require('moment');

var Partial = prime({

	constructor: function (varTypeTag, tplDesc) {
		this.varTypeTag = varTypeTag
		this.tplDesc = tplDesc
	},

	render: function() {
        var date = moment(this.tplDesc.values[this.varTypeTag.name]);
        var format = this.varTypeTag.format || 'YYYY-MM-DD';

        return Promise.from(date.format(format));
	}

});

module.exports = Partial