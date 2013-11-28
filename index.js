'use strict';

var TemplateController = require('./TemplateController')
var TempladteLoader = require('./TemplateLoader')
var item = require('./item')

var VTPartial = require('./VarTypeController/Partial')
var VTText = require('./VarTypeController/Text')
var VTDynPartial = require('./VarTypeController/DynPartial')

var VCTest = require('./ViewController/Test')
var VCUserList = require('./ViewController/UserList')

var tidy = require('htmltidy').tidy

var templateLoader = new TempladteLoader()
var templateController = new TemplateController(templateLoader)

templateController.registerVarTypeController('Partial', VTPartial)
templateController.registerVarTypeController('Text', VTText)
templateController.registerVarTypeController('DynPartial', VTDynPartial)

templateController.registerViewController('Test', VCTest)
templateController.registerViewController('UserList', VCUserList)


templateController.parse(item('index', {'pageTitle': 'AWESOME TEST'})).then(function(template) {
	tidy(template, {'indent': true, 'doctype': 'html5', 'hideComments': false}, console.log)
}, function(err) {
	console.log(err.stack)
})