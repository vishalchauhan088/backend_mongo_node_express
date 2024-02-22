const fs = require('fs');

//sync
//fs.mkdirSync


//async director creating

//checking if dir is there or not synchronously
if(fs.existsSync('your-file-here')){
    console.log('file exists');
}
else{
    //this is async part
    fs.mkdir('your-file-here',(err)=>{
        if(err){
            throw err
        }
        else{
            console.log('director created');
        }
    });
}

// this will be executed before sucess mssg || as mkdir  is async 
console.log('creating directory');