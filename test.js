"use strict";

var app = {};
var lib = require('./lib-node')(app);

/*console.log(lib.ts_to_sqldate(1448971006920));
console.log(lib.ts_to_sqldate('1448971006920'));
console.log(lib.ts_to_sqldate());
*/

/*console.log(lib.is_lat(90.0), lib.is_lng(-127.554334));
console.log(lib.is_lat(47.1231231), lib.is_lng(179.99999999));
console.log(lib.is_lat('-90.'), lib.is_lng('-180.'));
console.log(lib.is_lat('-90.'), lib.is_lng('-180.'));
console.log(lib.is_lat(-91), lib.is_lng('123.456'));
console.log(lib.is_lat('045'), lib.is_lng(180));
console.log(lib.is_lat(50.476765699999994), lib.is_lng(0));*/

/*console.log( lib.to_numstr(null) );
console.log( lib.to_numstr(0.1) );
console.log( lib.to_numstr(-0.1) );
console.log( lib.to_numstr('') );*/

//console.log( lib.serialize({foo:'Batman', joe:-0.5}) );

//console.log( lib.is_username('Bat', 3) );

console.log( lib.dtf() );
console.log( lib.dtf(null, 1) );
console.log( lib.dtf(null, 2, 0, '.') );