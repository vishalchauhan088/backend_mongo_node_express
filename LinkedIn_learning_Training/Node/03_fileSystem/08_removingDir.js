const fs = require('fs');

fs.rmdir('./folder2',(err)=>{
    if(err){
        console.log(err);
    }
    else{
        
    }
})
