const fs = require('fs');

//sync reading of file

// let data = fs.readFileSync('./input.txt','utf-8');
// console.log(data);

//async reading

fs.readFile('./input.txt','utf-8',(err,data)=>{
    if(err){
        throw err;
    }
    else{
        console.log(data);
    }
})

console.log('Reading File.....');
