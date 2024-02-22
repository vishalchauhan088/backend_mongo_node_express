const process = require('process');

// for( let  key in process){
//     console.log(key);
// }

process.on('beforeExit', (code)=>{
    console.log( `before exit (process.exitcode) : ${code}`)
});

process.on('exit', (code)=>{
    console.log( `before exit (process.exitcode) : ${code}`)
});

console.log('this will be executed first bcz it is the real job of process')
console.log('above to eventlistner will be executed synchronously after doing this || after no additional work to schedule');



