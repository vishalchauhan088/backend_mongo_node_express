//path.dirname('path') : return the name of dir

const path = require('path');

const file1 = 'vishal/mern/index.html'
const file2 = __filename;

console.log(`directory name is: ${path.dirname(file1)}`);

console.log(`file2 : ${file2}`);
console.log(`directory name is: ${path.dirname(file2)}`);
console.log(`base : ${path.basename(file2)}`);



