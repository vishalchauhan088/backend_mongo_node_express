const process = require('process');

// process.arg  is array which store all argument taken from console

console.log(process.argv);

// process.argv[0]: path to node executable
//process.argv[1] : path to file to be executed

//node 02_process.arg_.js  arg1 arg2 arg3
// read argument convention of command line
// node 02_process.arg_.js --user 'vishal' --greetings 'Good Morning'



function grab(flag){
    let flagIndex = process.argv.indexOf(flag);
    if(flagIndex !== -1){
        return process.argv[flagIndex+1];
    }
    return -1;
}

const user = grab('--user');
const greeting = grab('--greetings');

console.log('Command line argument is: ')

console.log(`user is : ${user}`);
console.log(`greeting is : ${greeting}`);
