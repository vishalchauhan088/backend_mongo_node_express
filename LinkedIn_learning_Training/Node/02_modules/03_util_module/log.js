//util.log(file_name) :: gives log details

const path = require('path');
const util = require('util'); 
const v8 = require('v8');  

util.log(path.basename(__filename));
console.log(v8.getHeapStatistics());