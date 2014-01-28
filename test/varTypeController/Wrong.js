'use strict';

var prime = require('prime');
var VTC = require('../../VarTypeController/VarTypeController')
var object = {
    'merge': require('mout/object/merge')
};

var Boolean = prime({

    inherits: VTC,

    constructor: function () {
        VTC.apply(this, arguments)
    }

});

module.exports = Boolean