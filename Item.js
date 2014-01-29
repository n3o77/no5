'use strict';

module.exports = function(template, values, pos, render) {
	return {
		'pos': pos || 0,
		'values': values || {},
		'template': template,
		'render': render !== false
	}
}