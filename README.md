# No5
# [![No5](http://data.unlooped.de/steffen/no5.png)]()
### INTERNAL REVIEW. v0.1.0Beta1

No5 is a completely logicless template system for the client and server which strictly separates template logic into controllers.
The name "No5" is a hommage to Johnny Number 5 from the 1986 Movie "Short Circuit".

## Intro

I introduced something I call "Types" which are placeholders in the templates with different purposes and default logic.
You can learn more about Types and their properties on the bottom of the page.

## Quick Start

#### Install
```bash
npm install no5
```

#### Usage

Because you can use No5 on Server and Client side you first have to register the modules you want to use.
So you always have the option to use a minimal version with less overhead. It also allows you to use
different modules which can only be executed on server or client side.

```js
var No5 = require('no5')
var TemplateLoader = require('no5/TemplateLoader')
var item = require('no5/item')
var templateLoader = new TemplateLoader({'templates': __dirname + '/templates'})
var no5 = new No5(templateLoader, {'throwError': true, 'mode': No5.ENUM_MODE.PRODUCTION})

no5.registerTypeController('Text', require('../TypeController/Text'))

no5.parse(item('helloWorld', {'test': 'Hello World'}), {'my': ['session', 'object']});
```

This will parse the helloWorld.html in the templates folder:
```html
<div>${"key": "test"}</div>
```

Result:
```html
<div>Hello World</div>
```


# API

## No5 / TemplateDescriptor

When requiring no5 it will return a TemplateDescriptor. The TemplateDescriptor saves your configuration and takes care that the TemplateController has access to the right Session object and constants.

```js
var No5 = require('no5')
new No5(templateLoader, constants)
```
#### Defaults:
```js
var constants = {
    'language': 'en_EN',
    'dateFormat': 'DD.MM.YYYY',
    'mode': ENUM_MODE.DEVELOP, // PRODUCTION, DEVELOP, DEBUG
    'throwError': false,
    'logger': console.log
}
```
no5.registerTypeController(String Name, TypeController Class)
no5.registerDataController(String Name, DataController Class)

#### Modes

Production:
Doesn't log anything.

Develop:
Logs basic information which are helpful to develop.
Adds a comment before and after each template with the template and dataController

Debug:
Logs everthing from `develop` and adds additional more internal stuff which helps you follow what exactly happens.

## TemplateLoader

You can provide different TemplateLoader. This is helpful when using No5 in the browser and loadind the templates via Ajax requests.

TemplateLoader (loads templates from the file system):
```js
var config = {
    'templates': null, //path to template dir
    'tplSuffix': 'html', //suffix of template files
     'cache': false //use template caching or not
}

var TemplateLoader = require('no5/TemplateLoader')
new TemplateLoader(config)
```
AjaxTemplateLoader (loads templates via Ajax request, you usually just call the TemplateLoader and send back its results):
```js
var config = {}

var TemplateLoader = require('no5/AjazTemplateLoader')
new TemplateLoader(config)
```

## TemplateItem

A TemplateItem describes the template which should be rendered.
```js
var item = require('no5/item')
item('template', {'key': 'value'}, position, render)
```
The first parameter defines the template filename you want to render.
The second parameter expects an object with the values for the defined types in the template.
You can pass multiple items to a partial Type. For that you can set a position (third parameter) and also if this item should be rendered (fourth paramert).

## View Controller

You can set to ever Type a dataController which handles action related to this. For example you can define a partial Type and decide in the DataController which partials should be rendered.
You first have to register the dataController:
```js
var No5 = require('no5')
var TemplateLoader = require('no5/TemplateLoader')
var item = require('no5/item')
var templateLoader = new TemplateLoader({'templates': __dirname + '/templates'})
var no5 = new No5(templateLoader, {'throwError': true, 'mode': No5.ENUM_MODE.PRODUCTION})

no5.registerTypeController('Text', require('../TypeController/Text'))
//... register more typeController

no5.registerDataController('Test', require('./dataController/Test'))
//... register more dataController

no5.parse(item('helloWorld', {'test': 'Hello World'}), {'my': ['session', 'object']});

```

DataController (./dataController/Test.js):
```js
'use strict';

var prime = require('prime')
var VC = require('no5/DataController')
var Promise = require('promise')

var Test = prime({

    inherits: VC,

    constructor: function () {
        VC.apply(this, arguments)
    },

    parse: function() {
        return new Promise(function(resolve, reject) {
            this.item.values.test = new Date(1970, 0, 2)
            resolve()
        }.bind(this));
    }

})

module.exports = Test
```

Template:
```html
<div>${'type': 'partial', 'key': 'test', 'dataController': 'Test'}</div>
```

## TypeController

TypeController is a little helper which helps you to build your template and format values easily and consistently.
You can register the same TypeController with differnt defaults which makes them very powerful.

No5 also supports an autocasting of types, so if you don't specify a type in the templateVar ( `${'key': 'test'} ) it looks at the given value and decides which typeController to use.
It does this by getting the kind of the value and looks if a typeController with this type is defined. ( http://moutjs.com/docs/v0.8.0/lang.html#kindOf )

Example:
```js
...

no5.registerTypeController('Number', require('../TypeController/Number'))
no5.registerTypeController('Price', require('../TypeController/Number'), {'decimals': 2, 'decPoint': ',', 'thousandsSep': '.', 'suffix': '$'})
no5.registerTypeController('Percent', require('../TypeController/Number'), {'decimals': 0, 'suffix': '%'})

...
```
demo.html:
```html
<div>Number: ${'type': 'number', 'key': 'test'}</div>
<div>Price: ${'type': 'Price', 'key': 'test'}</div>
<div>Percent: ${'type': 'Percent', 'key': 'test'}</div>
```

```js
no5.render(item('demo', {'test': 12.34})).then(function(result) {
    console.log(result)
})
```

```html
<div>Number: 12</div>
<div>Price: 12,34$</div>
<div>Percent: 12%</div>
```

### Boolean

Very simple typeController for returning single words:
demo.html:
```html
<div>${'key': 'test', 'type': 'boolean', 'true': 'Hello', 'false': 'world'}</div>
```

```js
no5.render(item('demo', {'test': true})).then(function(result) {
    console.log(result)
})
```

Result:
```html
<div>Hello</div>
```

### Date

Date renderer with basic formatting options.
You can use the following formatting options: http://moutjs.com/docs/v0.8.0/date.html#strftime

demo.html:
```html
<div>${'key': 'test', 'type': 'date', 'format': '%d.%m.%Y'}</div>
```

Accepts a JS Date or a ISO8601 String (http://moutjs.com/docs/v0.8.0/date.html#parseIso)
```js
no5.render(item('demo', {'test': new Date(2000, 3, 5)})).then(function(result) {
    console.log(result)
})
```

Result:
```html
<div>05.04.2000</div>
```

Defaults:
```js
{
    'format': '%Y-%m-%d'
}
```

### Number

Basic Number Formatting

demo.html:
```html
<div>${'key': 'test', 'type': 'number', 'decimals': '2', 'pad': 2}</div>
```

```js
no5.render(item('demo', {'test': 1.234})).then(function(result) {
    console.log(result)
})
```

Result:
```html
<div>01.23</div>
```

Defaults:
```js
{
    'decimals': 0,
    'decPoint': '.',
    'thousandsSep': ',',
    'pad': null,
    'padChar': null,
    'prefix': '',
    'suffix': ''
}
```

### Text

Just returns a text. If no text is given it tries to JSON.stringify it and returns that.

demo.html:
```html
<div>${'key': 'test', 'type': 'text'}</div>
```

```js
no5.render(item('demo', {'test': 'abc'})).then(function(result) {
    console.log(result)
})
```

Result:
```html
<div>abc</div>
```

Defaults:
```js
{}
```

### Partial

Partial is propably the most powerful Type. You can dynamically load multiple templates, sort them, hide them etc.

demo.html:
```html
<div>${'key': 'test', 'type': 'partial'}</div>
```

a.html:
```html
<div>${'key': 'name', 'type': 'text'}</div>
```

```js
no5.render(item('demo', {'test': [item('a', {'name': 'tpl a1'}, 2), item('a', {'name': 'tpl a2', 1})]})).then(function(result) {
    console.log(result)
})
```

Result:
```html
<div><div>tpl a2</div><div>tpl a1</div></div>
```

If you set a template on the typeTag you can pass an array with objects which then are given as the values of the template:

demo.html:
```html
<div>${'key': 'test', 'type': 'partial', 'template': 'a'}</div>
```

a.html:
```html
<div>${'key': 'name', 'type': 'text'}</div>
```

```js
no5.render(item('demo', {'test': [{'name': 'hello'}, {'name': 'world'}]})).then(function(result) {
    console.log(result)
})
```

Result:
```html
<div><div>hello</div><div>world</div></div>
```

## Best Practices

Create one file which defines everything you need and which you then use in your program.
If you want to use the lib on the client side you should create another one with the required stuff and then convert this file with wrapup or browserify.
```js
var No5 = require('no5')
var TemplateLoader = require('no5/TemplateLoader')

var templateLoader = new TemplateLoader({'templates': __dirname + '/templates'})
var no5 = new No5(templateLoader, {'throwError': true, 'mode': TemplateDescriptor.ENUM_MODE.PRODUCTION})

no5.registerTypeController('Partial', require('../TypeController/Partial'))
no5.registerTypeController('Text', require('../TypeController/Text'))
no5.registerTypeController('Date', require('../TypeController/Date'))
no5.registerTypeController('TestDate', require('../TypeController/Date'), {'format': '%m.%d.%Y'})
no5.registerTypeController('SessionDate', require('../TypeController/Date'), {'format': '__session.formats.date'})
no5.registerTypeController('Number', require('../TypeController/Number'))
no5.registerTypeController('TestNumber', require('../TypeController/Number'), {'decimals': 3, 'decPoint': ',', 'thousandsSep': '.'})
no5.registerTypeController('Select', require('../TypeController/form/Select'))
no5.registerTypeController('Boolean', require('../TypeController/Boolean'), {'true': 'yes', 'false': 'no'})
no5.registerTypeController('Bool', require('../TypeController/Boolean'))
no5.registerTypeController('Wrong', require('./TypeController/Wrong'))

no5.registerDataController('Test', require('./dataController/Test'))
no5.registerDataController('Wrong', require('./dataController/Wrong'))

module.exports = {
    'item': require('../item'),
    'render': function(item, session) {
        return templateDescriptor.parse(item, session);
    }
}
```
