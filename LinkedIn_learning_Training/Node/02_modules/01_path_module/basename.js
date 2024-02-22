const path = require('path');

// path.basename('path') : returns file name

const currFile = __filename; // gives absolute path to a file
console.log(currFile);
console.log(`Current File Name is: ${path.basename(currFile)}`);

// with suffix: optional : an sufix to remove
//path.basename('path','suffix') //
console.log(`\n\ncurrent file name without extension is: ${path.basename('webdev/mern/moveApi.js',  '.js')}`);
