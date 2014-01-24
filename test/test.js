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
    })

    describe('Basics', function() {

    })

});