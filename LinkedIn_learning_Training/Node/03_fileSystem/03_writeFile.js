const fs = require('fs');

//sync
// try{
//     fs.writeFileSync('output.txt','hello there');
//     console.log('file written');
// }
// catch(err){
//     console.log(err);
// }

let md = `
    This is a new file
    =================

    ES6 template string honor whitespaces;

    *Template String
    *Node File System
    *Readlin CLIs
`

fs.writeFile('readme.md',md,'utf-8',(err)=>{
    if(err){
        console.log(err)
    }
    else{
        try{
            fs.appendFileSync('readme.md','\n\n##Loving this tutorial of Node.js');
        }
        catch(e){
            throw e;
        }
        console.log("File written Successfully");
    }
})

console.log('Writing file.......');


