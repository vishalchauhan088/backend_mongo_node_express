const fs = require('fs');

// fs.renameSync('./your-file-here/file2.md', './your-file-here/file2.txt'); // this will rename | change extension | move to root dir or as specified
// console.log('file renamed');

//moving a file using rename

fs.rename('./your-file-here/file2.txt','./file2.txt',(err)=>{
    if(err){
        console.log(err);
    }
    else{
        console.log('./your-file-here/file2.txt has moved to root director');
    }
})