"use strict";

function fromPath(source, parts) {
    if (!source || !parts) return ''
    if (typeof parts == 'string') parts = parts.split('.')
    for (var i = 0, l = parts.length; i < l; i++) {
        if (source[parts[i]]) source = source[parts[i]]
        else return null
    }
    return source
}

module.exports = fromPath