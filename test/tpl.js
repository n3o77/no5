var TemplateDescriptor = require('../TemplateDescriptor')
var TemplateLoader = require('../TemplateLoader')

var i18nDe = require('mout/date/i18n/de-DE')
i18nDe.x = "%e. %B %Y"
var i18nUs = require('mout/date/i18n/en-US')
i18nUs.x = "%B %e, %Y"

var templateLoader = new TemplateLoader({'templates': __dirname + '/templates'})
var templateDescriptor = new TemplateDescriptor(templateLoader, {'throwError': true, 'mode': TemplateDescriptor.ENUM_MODE.PRODUCTION})

templateDescriptor.registerTypeController('Partial', require('../TypeController/Partial'))
templateDescriptor.registerTypeController('Text', require('../TypeController/Text'))
templateDescriptor.registerTypeController('TextEscapeHtml', require('../TypeController/Text'), {'escapeHtml': true})
templateDescriptor.registerTypeController('Date', require('../TypeController/Date'), {'locales': {'de_DE': i18nDe, 'en_US': i18nUs}})
templateDescriptor.registerTypeController('TestDate', require('../TypeController/Date'), {'format': '%m.%d.%Y'})
templateDescriptor.registerTypeController('SessionDate', require('../TypeController/Date'), {'format': '__session.formats.date'})
templateDescriptor.registerTypeController('Number', require('../TypeController/Number'))
templateDescriptor.registerTypeController('TestNumber', require('../TypeController/Number'), {'decimals': 3, 'decPoint': ',', 'thousandsSep': '.'})
templateDescriptor.registerTypeController('Boolean', require('../TypeController/Boolean'))
templateDescriptor.registerTypeController('Bool', require('../TypeController/Boolean'), {'true': 'yes', 'false': 'no'})
templateDescriptor.registerTypeController('Wrong', require('./TypeController/Wrong'))
templateDescriptor.registerTypeController('Options', require('../TypeController/form/Options'))

templateDescriptor.registerDataController('Test', require('./dataController/Test'))
templateDescriptor.registerDataController('Wrong', require('./dataController/Wrong'))

module.exports = {
    'item': require('../Item'),
    'render': function(item, session) {
        return templateDescriptor.parse(item, session);
    }
}