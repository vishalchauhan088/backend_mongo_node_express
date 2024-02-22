const fs = require('fs');

//reading all the files of directory || synchronous
// let files = fs.readdirSync('./');

// console.log(files);

// async reading

fs.readdir("./",(err,files)=>{
    if(err){
        throw err;
    }
    else{
        console.log(files);
    }
});
console.log('reading files.....');