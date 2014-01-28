'use strict';

var prime = require('prime')

var VarTypeController = prime({

    options: {},

    constructor: function (varTypeTag, item, templateController, options) {
        this.options = object.merge(this.options, options)
        this.varTypeTag = varTypeTag
        this.item = item
        this.templateController = templateController
    },

    render: function() {
        throw Error('Render method not implemented in VarTypeConrtoller: ' + this.varTypeTag.type);
    }

})

module.exports = VarTypeController