"use strict";

var app = {};
var lib = require('./lib-node')(app);

console.log(lib.ts_to_sqldate(1448971006920));
console.log(lib.ts_to_sqldate('1448971006920'));
console.log(lib.ts_to_sqldate());