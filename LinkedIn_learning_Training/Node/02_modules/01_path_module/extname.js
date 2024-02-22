//path.extname('path') // returns the extension name
const path = require('path');

console.log(`extname of index.html : ${path.extname("abs\\index.html")}`);
console.log(`extname of extname.js: ${path.extname("vishal/extname.js")}`);
console.log(`extname of Readme.md: ${path.extname("Readme.md")}`);
