'use strict';

var prime = require('prime')
var TemplateController = require('./TemplateController')
var object = {
    'merge': require('mout/object/merge'),
    'forOwn': require('mout/object/forOwn')
}

var ENUM_MODE = require('./enums').ENUM_MODE

var TemplateDescriptor = prime({

    'constants': {
        'language': 'en_EN',
        'dateFormat': 'DD.MM.YYYY',
        'mode': ENUM_MODE.DEVELOP,
        'throwError': false
    },

    'ENUM_MODE': ENUM_MODE,

    'varTypeController': null,
    'viewController': null,

    constructor: function (templateLoader, constants) {
        this.constants = object.merge(this.constants, constants);

        this.templateLoader = templateLoader

        this.varTypeController = {}
        this.viewController = {}
    },

    registerVarTypeController: function(name, controller, options) {
        this.varTypeController[name] = {'controller': controller, 'options': options}
    },

    registerViewController: function(name, controller, options) {
        this.viewController[name] = {'controller': controller, 'options': options}
    },

    getViewController: function(name) {
        if (this.viewController[name]) return this.viewController[name].controller
        return null
    },

    getTemplateController: function() {
        var tplController = new TemplateController(this.templateLoader, this.constants)

        object.forOwn(this.varTypeController, function(item, name) {
            tplController.registerVarTypeController(name, item.controller, item.options)
        })

        object.forOwn(this.viewController, function(item, name) {
            tplController.registerViewController(name, item.controller, item.options)
        })

        return tplController
    },

    parse: function(item, session) {
        var tplController = this.getTemplateController()
        tplController.setSession(session)

        return tplController.parse(item)
    }

});

TemplateDescriptor.ENUM_MODE = ENUM_MODE

module.exports = TemplateDescriptor