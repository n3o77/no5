'use strict';

module.exports = function(template, values, pos, childs) {
	if (!template) throw new Error('No Template given')
	return {
		'childs': childs || [],
		'pos': pos || 0,
		'values': values || {},
		'template': template,
		'render': true
	}
}