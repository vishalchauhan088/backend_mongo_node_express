const fs = require('fs');

//sync

// try{
    
//     fs.unlinkSync('./your-file-here/file2.txt');
//     console.log('removed file')
// }
// catch(err){
//     console.log(err)
// }

//async

fs.unlink('./file2.txt',(err)=>{
    if(err){
        console.log(err)
    }
    else{
        console.log('file removed');
    }
    
})