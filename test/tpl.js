var Promise = require('promise')
var TemplateDescriptor = require('../TemplateDescriptor')
var TemplateLoader = require('../TemplateLoader')

var templateLoader = new TemplateLoader({'templates': __dirname + '/templates'})
var templateDescriptor = new TemplateDescriptor(templateLoader)

templateDescriptor.registerVarTypeController('Partial', require('../VarTypeController/Partial'))
templateDescriptor.registerVarTypeController('Text', require('../VarTypeController/Text'))
templateDescriptor.registerVarTypeController('DynPartial', require('../VarTypeController/DynPartial'))
templateDescriptor.registerVarTypeController('Date', require('../VarTypeController/Date'))
templateDescriptor.registerVarTypeController('TestDate', require('../VarTypeController/Date'), {'format': '%m.%d.%Y'})
templateDescriptor.registerVarTypeController('Number', require('../VarTypeController/Number'))
templateDescriptor.registerVarTypeController('TestNumber', require('../VarTypeController/Number'), {'decimals': 3, 'decPoint': ',', 'thousandsSep': '.'})
templateDescriptor.registerVarTypeController('Select', require('../VarTypeController/form/Select'))
templateDescriptor.registerVarTypeController('Boolean', require('../VarTypeController/Boolean'), {'true': 'yes', 'false': 'no'})
templateDescriptor.registerVarTypeController('Bool', require('../VarTypeController/Boolean'))

templateDescriptor.registerViewController('Test', require('./viewController/Test'))

module.exports = {
    'item': require('../item'),
    'render': function(item, session) {
        return templateDescriptor.parse(item, session);
    }
}