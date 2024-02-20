const fs = require('fs');

// readFile(path,encode,callback)

fs.readFile('./read.tx','utf-8',(err, data1) =>{
    if(err){
        return console.log("ERROR",err)
    }
    console.log(data1);
    fs.readFile(`./${data1}.txt`,'utf-8',(err,data2)=>{
        console.log(data2);

        fs.readFile(`./output.txt`,'utf-8',(err,data3)=>{
            
            //writing file

            fs.writeFile('./final.txt', `${data2} \n\n ${data3}`, err =>{

                if(err){
                    console.log(err);
                }
                else{
                    console.log("File written")
                }
                
            })

            
    
            
        })
        
    })
     
})

console.log('below file reading');