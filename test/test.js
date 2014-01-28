require("mocha-as-promised")();
var chai = require('chai')
var expect = chai.expect
var chaiAsPromised = require("chai-as-promised")
chai.use(chaiAsPromised)

var strftime = require('mout/date/strftime')

var template = require('./tpl')

describe('Template System', function() {

    describe('VarType Text', function() {
        it('should replace text with given parameters', function() {
            return expect(template.render(template.item('vt_text', {'test': 'foo'}))).to.eventually.be.eql('<div>foo</div>')
        })

        it('should convert non text values to a string with JSON.stringify', function() {
            return expect(template.render(template.item('vt_text', {'test': {'abc': 'def'}}))).to.eventually.be.eql('<div>{"abc":"def"}</div>')
        })
    })

    describe('VarType Date', function() {
        it('should replace date tag', function() {
            return expect(template.render(template.item('vt_date1', {'test': new Date(1970, 0, 2)}))).to.eventually.be.eql('<div>1970-01-02</div>')
        })

        it('should display date with custom format', function() {
            return expect(template.render(template.item('vt_date2', {'test': new Date(1970, 0, 2)}))).to.eventually.be.eql('<div>02.01.1970</div>')
        })

        it('should use testDate type with custom options', function() {
            return expect(template.render(template.item('vt_date3', {'test': new Date(1970, 0, 2)}))).to.eventually.be.eql('<div>01.02.1970</div>')
        })

        it('should parse date from ISO8601 string', function() {
            return expect(template.render(template.item('vt_date4', {'test': '1970-01-02'}))).to.eventually.be.eql('<div>'+Date.UTC(1970, 0, 2) / 1000+'</div>')
        })
    })

    describe('VarType Number', function() {
        it('should replace number tag and round up', function() {
            return expect(template.render(template.item('vt_number1', {'test': 1.55}))).to.eventually.be.eql('<div>2</div>')
        })

        it('should replace number tag and round down', function() {
            return expect(template.render(template.item('vt_number1', {'test': 1.49}))).to.eventually.be.eql('<div>1</div>')
        })

        it('should display number with custom format', function() {
            return expect(template.render(template.item('vt_number2', {'test': 1.55}))).to.eventually.be.eql('<div>1,55</div>')
        })

        it('should use testNumber type with custom options', function() {
            return expect(template.render(template.item('vt_number3', {'test': 1234.55}))).to.eventually.be.eql('<div>1.234,550</div>')
        })

        it('should display number with pad options', function() {
            return expect(template.render(template.item('vt_number4', {'test': 12.55}))).to.eventually.be.eql('<div>__12.55</div>')
        })

        it('should display number with prefix and suffix', function() {
            return expect(template.render(template.item('vt_number5', {'test': 12.55}))).to.eventually.be.eql('<div>$12.55%</div>')
        })
    })

    describe('VarType Partial', function() {
        it('should replace partial tag with given template', function() {
            return expect(template.render(template.item('vt_partial1'))).to.eventually.be.eql('<div>ab</div>')
        })

        it('should accept item', function() {
            var innerItem = template.item('vt_partial3_p1', {'test': 'p1'});
            var item = template.item('vt_partial2', {'test': innerItem});

            return expect(template.render(item)).to.eventually.be.eql('<div>ap1b</div>')
        })

        it('should replace dynPartial tag', function() {
            var items = []
            items.push(template.item('vt_partial3_p1', {'test': 'p1'}))
            items.push(template.item('vt_partial3_p2', {'test': 'p2'}))

            return expect(template.render(template.item('vt_partial3', {'test': items}))).to.eventually.be.eql('<div>ap1bcp2d</div>')
        })

        it('should order the items', function() {
            var items = []
            items.push(template.item('vt_partial3_p1', {'test': 'p1'}, 2))
            items.push(template.item('vt_partial3_p2', {'test': 'p2'}, 1))

            return expect(template.render(template.item('vt_partial3', {'test': items}))).to.eventually.be.eql('<div>cp2dap1b</div>')
        })

        it('should not render items with render = false', function() {
            var items = []
            items.push(template.item('vt_partial3_p1', {'test': 'p1'}, 2, false))
            items.push(template.item('vt_partial3_p2', {'test': 'p2'}, 1))

            return expect(template.render(template.item('vt_partial3', {'test': items}))).to.eventually.be.eql('<div>cp2d</div>')
        })

        it('should support multiple formats as items and sort them correctly', function() {
            var items = []
            items.push(template.item('vt_partial3_p1', {'test': ' ps3 '}, 3))
            items.push({'vt_partial3_p2': {'test': ' op2 '}})
            items.push('vt_partial3_p3')
            items.push(template.item('vt_partial3_p1', {'test': ' ps1 '}, 1))
            items.push(template.item('vt_partial3_p1', {'test': ' ps2 '}, 2))

            return expect(template.render(template.item('vt_partial2', {'test': items}))).to.eventually.be.eql('<div>a ps1 ba ps2 ba ps3 bc op2 def</div>')
        })
    })

    describe('VarType Boolean', function() {
        it('should replace boolean tag with custom true', function() {
            return expect(template.render(template.item('vt_boolean1', {'test': true}))).to.eventually.be.eql('<div>yes</div>')
        })

        it('should replace boolean tag with custom false', function() {
            return expect(template.render(template.item('vt_boolean1', {'test': false}))).to.eventually.be.eql('<div>no</div>')
        })

        it('should replace boolean tag with true', function() {
            return expect(template.render(template.item('vt_boolean2', {'test': true}))).to.eventually.be.eql('<div>true</div>')
        })

        it('should replace boolean tag with false', function() {
            return expect(template.render(template.item('vt_boolean2', {'test': false}))).to.eventually.be.eql('<div>false</div>')
        })
    })

    describe('Auto Casting for VarTypes', function() {
        it('should autocast boolean to boolean', function() {
            return expect(template.render(template.item('vt_autocast', {'test': true}))).to.eventually.be.eql('<div>yes</div>')
        });

        it('should autocast date to date', function() {
            return expect(template.render(template.item('vt_autocast', {'test': new Date(1970, 0, 2)}))).to.eventually.be.eql('<div>1970-01-02</div>')
        });

        it('should autocast number to number', function() {
            return expect(template.render(template.item('vt_autocast', {'test': 12345678.9}))).to.eventually.be.eql('<div>12,345,679</div>')
        });

        it('should autocast string to text', function() {
            return expect(template.render(template.item('vt_autocast', {'test': '000123.9ABC'}))).to.eventually.be.eql('<div>000123.9ABC</div>')
        });

        it('should autocast item to partial', function() {
            var item = template.item('vt_partial3_p1', {'test': 'p1'});
            return expect(template.render(template.item('vt_autocast', {'test': item}))).to.eventually.be.eql('<div>ap1b</div>')
        });

        it('should autocast array with items to dynPartial', function() {
            var items = []
            items.push(template.item('vt_partial3_p1', {'test': 'p1'}, 2))
            items.push(template.item('vt_partial3_p2', {'test': 'p2'}, 1))

            return expect(template.render(template.item('vt_autocast', {'test': items}))).to.eventually.be.eql('<div>cp2dap1b</div>')
        });

        it('should autocast array with objects with item value to dynPartial (key = template, value = values)', function() {
            var items = [{'vt_partial3_p1': {'test': 'p1'}},{'vt_partial3_p2': {'test': 'p2'}}]
            return expect(template.render(template.item('vt_autocast', {'test': items}))).to.eventually.be.eql('<div>ap1bcp2d</div>')
        });

        it('should autocast array with no items to text', function() {
            return expect(template.render(template.item('vt_autocast', {'test': [1, 2, 3]}))).to.eventually.be.eql('<div>[1,2,3]</div>')
        });
    })

    describe('View Controller', function() {
        it('should manipulate all item vars', function() {
            return expect(template.render(template.item('vt_viewController', {'test': "abc"}))).to.eventually.be.eql('<div>1970-01-02</div>')
        })
    })

    describe('Error Handling', function() {
        it('should give the right position of the vartype in the template if varType is invalid', function() {
            return expect(template.render(template.item('err_t1', {'test': 'foo'}))).to.eventually.be.rejectedWith('ERROR WITH VARTYPE: {\'key\': \'test2} in Template: err_t1:9:36')
        })

        it('should give the right position of the vartype in the template if type doesn\'t exist', function() {
            return expect(template.render(template.item('err_t2', {'test': 'foo'}))).to.eventually.be.rejectedWith('varTypeController "Foo" not available. From: err_t2:14:13')
        })

        it('should throw an error that the render method is missing in "Wrong" VarTypeController', function() {
            return expect(template.render(template.item('err_t3', {'test': 'foo'}))).to.eventually.be.rejectedWith('Render method not implemented in VarTypeConrtoller: Wrong From:err_t3:1:8')
        })
    })

});