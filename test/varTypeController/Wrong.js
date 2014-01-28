'use strict';

var prime = require('prime');
var VTC = require('../../VarTypeController/VarTypeController')
var object = {
    'merge': require('mout/object/merge')
};

var Boolean = prime({

    inherits: VTC,

    options: {
        "true": "true",
        "false": "false"
    },

    constructor: function (varTypeTag, item, templateController, options) {
        this.options = object.merge(this.options, options)
        this.varTypeTag = varTypeTag
        this.item = item
        this.templateController = templateController
    }

});

module.exports = Boolean