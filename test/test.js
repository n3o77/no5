require("mocha-as-promised")();
var chai = require('chai')
var expect = chai.expect
var chaiAsPromised = require("chai-as-promised")
chai.use(chaiAsPromised)

var template = require('./tpl')

describe('Template System', function() {

    describe('VarType Text', function() {
        it('should replace text with given parameters', function() {
            return expect(template.render(template.item('vt_text', {'test': 'foo'}))).to.eventually.be.eql('<div>foo</div>')
        })
    })

    describe('VarType Date', function() {
        it('should replace date tag', function() {
            return expect(template.render(template.item('vt_date1', {'test': new Date(86400000)}))).to.eventually.be.eql('<div>1970-01-02</div>')
        })

        it('should display date with custom format', function() {
            return expect(template.render(template.item('vt_date2', {'test': new Date(86400000)}))).to.eventually.be.eql('<div>02.01.1970</div>')
        })

        it('should use testDate type with custom options', function() {
            return expect(template.render(template.item('vt_date3', {'test': new Date(86400000)}))).to.eventually.be.eql('<div>01.02.1970</div>')
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
        it('should replace partial tag', function() {
            return expect(template.render(template.item('vt_partial1'))).to.eventually.be.eql('<div>ab</div>')
        })
    })

    describe('VarType DynPartial', function() {
        it('should replace dynPartial tag', function() {
            var items = []
            items.push(template.item('vt_dynpartial1_p1', {'test': 'p1'}))
            items.push(template.item('vt_dynpartial1_p2', {'test': 'p2'}))

            return expect(template.render(template.item('vt_dynpartial1', {'test': items}))).to.eventually.be.eql('<div>ap1bcp2d</div>')
        })

        it('should order the items', function() {
            var items = []
            items.push(template.item('vt_dynpartial1_p1', {'test': 'p1'}, 2))
            items.push(template.item('vt_dynpartial1_p2', {'test': 'p2'}, 1))

            return expect(template.render(template.item('vt_dynpartial1', {'test': items}))).to.eventually.be.eql('<div>cp2dap1b</div>')
        })

        it('should not render items', function() {
            var items = []
            items.push(template.item('vt_dynpartial1_p1', {'test': 'p1'}, 2, false))
            items.push(template.item('vt_dynpartial1_p2', {'test': 'p2'}, 1))

            return expect(template.render(template.item('vt_dynpartial1', {'test': items}))).to.eventually.be.eql('<div>cp2d</div>')
        })
    })

    describe('VarType Boolean', function() {
        it('should replace boolean tag with true', function() {
            return expect(template.render(template.item('vt_boolean1', {'test': true}))).to.eventually.be.eql('<div>true</div>')
        })

        it('should replace boolean tag with false', function() {
            return expect(template.render(template.item('vt_boolean1', {'test': false}))).to.eventually.be.eql('<div>false</div>')
        })

        it('should replace boolean tag with custom true', function() {
            return expect(template.render(template.item('vt_boolean2', {'test': true}))).to.eventually.be.eql('<div>yes</div>')
        })

        it('should replace boolean tag with custom false', function() {
            return expect(template.render(template.item('vt_boolean2', {'test': false}))).to.eventually.be.eql('<div>no</div>')
        })
    })

    describe('Basics', function() {

    })

});