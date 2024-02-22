
// path.parse(string) // returns object after breaking path

// The returned object will have the following properties:

// dir <string>
// root <string>
// base <string>
// name <string>
// ext <string>

// path.format({}) // returns a string of url 

// pathObject <Object> Any JavaScript object having the following properties:
// dir <string>
// root <string>
// base <string>
// name <string>
// ext <string>

const path = require('path');

const filepath = __filename;

const parsedObj = path.parse(filepath);
console.log(`parse object is :`);
console.log(parsedObj);

console.log('path created parsedObjet is: ');
console.log(path.format(parsedObj));