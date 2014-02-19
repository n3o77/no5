'use strict';

var prime = require('prime')
var object = {
    'merge': require('mout/object/merge')
};

var DataController = prime({

    constructor: function (objVar, values, templateController, options) {
        this.options = object.merge(this.options, options)
        this.objVar = objVar
        this.typeTag = objVar.typeTag
        this.values = values
        this.templateController = templateController
        this.__log = this.templateController.log
    },

    parse: function() {
        this.__log.error('Parse method not implemented in DataController: ' + (this.typeTag.dc || this.typeTag.dataController) + ' From:' + this.objVar.template + ':' + this.objVar.pos.line + ':' + this.objVar.pos.col);
    }

})

module.exports = DataController