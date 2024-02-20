const fs = require('fs')

const quotes = fs.readFileSync('./quotes.txt', 'utf-8');

console.log(quotes);

const textOut = `This is the quotes we have. \n\n ${quotes} \n\n\n written on : ${Date.now()}`;

fs.writeFileSync('./output.txt',textOut );
console.log("file written")