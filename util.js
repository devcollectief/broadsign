'use strict';

// var dependencies
var util = require('util');

exports = module.exports = {
    inspect: function (obj, verbose) {
        verbose = verbose || false;
        console.log('\n');
        console.log(util.inspect(obj, {
            showHidden: true,
            depth: 10,
            colors: true
        }));
        console.log('\n');
        if(verbose) console.log(JSON.stringify(obj));
    }
};
