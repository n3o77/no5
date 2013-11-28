'use strict';

module.exports = function(template, values, pos, render) {
	if (!template) throw new Error('No Template given')
	return {
		'pos': pos || 0,
		'values': values || {},
		'template': template,
		'render': render !== false
	}
}