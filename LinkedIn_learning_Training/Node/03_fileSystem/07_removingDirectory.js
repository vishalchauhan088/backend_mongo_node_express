const fs = require('fs');

//this will not work if there are pre-existing files and folder in  folder to delete
fs.rmdir('./your-file-here',(err)=>{
    if(err){
        console.log(err)
    }
    else{
        console.log("Deleted successfully");
    }
});

console.log('deleting folder');