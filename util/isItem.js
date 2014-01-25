'use strict';

var item = require('../item')

var lang = {
    'isObject': require('mout/lang/isObject')
}

var array = {
    'xor': require('mout/array/xor')
}

var object = {
    'keys': require('mout/object/keys')
}

module.exports = function(value) {
    if (!lang.isObject(value)) return false;
    return (array.xor(object.keys(value), object.keys(item(' '))).length === 0)
}