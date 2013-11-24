'use strict';

var TemplateController = require('./TemplateController')
var TempladteLoader = require('./TemplateLoader')
var item = require('./item')
var VTPartial = require('./VarTypeController/Partial');


var templateLoader = new TempladteLoader()
var templateController = new TemplateController(templateLoader)
templateController.registerVarTypeController('Partial', VTPartial)

templateController.parse(item('./templates/index.html')).then(function(template) {
	console.log(template)
}, function(err) {
	console.log(err.stack)
})