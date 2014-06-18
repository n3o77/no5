'use strict';

var Promise = require('promise')
var prime = require('prime')
var Log = require('./Log')
var TemplateParser = require('./TemplateParser')
var lang = {
    'deepClone': require('mout/lang/deepClone')
}

var TemplateController = prime({

    'typeController': null,
    'dataController': null,
    'session': null,
    'constants': null,

    constructor: function (templateLoader, constants) {
        /** @type {TemplateLoader} */
        this.templateLoader = templateLoader
        this.constants = constants

        this.typeController = {}
        this.dataController = {}
        this.log = new Log(this.constants.mode, this.constants.logger, this.constants.throwError)
    },

    setSession: function(session) {
        this.session = session
    },

    getSession: function() {
        return this.session || {}
    },

    getConstants: function() {
        return lang.deepClone(this.constants || {})
    },

    registerTypeController: function(name, controller, options) {
        this.typeController[name] = {'controller': controller, 'options': options}
    },

    registerDataController: function(name, controller, options) {
        this.dataController[name] = {'controller': controller, 'options': options}
    },

    getDataController: function(name) {
        if (this.dataController[name]) return this.dataController[name]
        return null
    },

    parse: function(item) {
        if (!item.template) this.log.error('No Template Given', item)
        if (!item.render) return Promise.resolve('')

        return this.templateLoader.loadTemplate(item.template).then(function(tpl) {
            var tplParser = this.getTemplateParser(item)
            return tplParser.parse(tpl)
        }.bind(this))
    },

    getTemplateParser: function(item) {
        return new TemplateParser(this.typeController, this, item)
    }

});

module.exports = TemplateController