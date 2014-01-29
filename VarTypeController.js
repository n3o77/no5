'use strict';

var prime = require('prime')
var object = {
    'merge': require('mout/object/merge')
};


var VarTypeController = prime({

    options: {},

    constructor: function (objVar, item, templateController, options) {
        this.options = object.merge(this.options, options)
        this.objVar = objVar
        this.varTypeTag = objVar.tplVar
        this.item = item
        this.templateController = templateController
        this.__log = this.templateController.log
    },

    render: function() {
        this.__log.error('Render method not implemented in VarTypeConrtoller: ' + this.varTypeTag.type + ' From:' + this.item.template + ':' + this.objVar.pos.line + ':' + this.objVar.pos.col);
    }

})

module.exports = VarTypeController