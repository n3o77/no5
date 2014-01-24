'use strict';

var TemplateController = require('./TemplateController')
var TemplateLoader = require('./TemplateLoader')
var item = require('./item')

var VTPartial = require('./VarTypeController/Partial')
var VTText = require('./VarTypeController/Text')
var VTDynPartial = require('./VarTypeController/DynPartial')

var VCTest = require('./ViewController/Test')
var VCUserList = require('./ViewController/UserList')

var tidy = require('htmltidy').tidy

var templateLoader = new TemplateLoader()
var templateController = new TemplateController(templateLoader)

var number =  new require('./ViewController/Test')({'...': '...'});
var currency = new NumberVarTypeBlah({'...': '...'});

templateController.registerVarTypeController('Partial', VTPartial)
templateController.registerVarTypeController('Text', VTText)
templateController.registerVarTypeController('DynPartial', VTDynPartial)
templateController.registerVarTypeController('Number', number);
templateController.registerVarTypeController('Currency', currency);

templateController.registerViewController('Test', VCTest)
templateController.registerViewController('UserList', VCUserList)


templateController.parse(item('index', {'pageTitle': 'AWESOME TEST'})).then(function(template) {
	tidy(template, {'indent': true, 'doctype': 'html5', 'hideComments': false}, console.log)
}, function(err) {
	console.log(err.stack)
})