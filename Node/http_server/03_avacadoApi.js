const http = require('http');
const fs = require('fs');

const server = http.createServer( (req, res)=>{

    const path = req.url;

    if(path === '/' || path === '/overview'){
        res.end("This is overview Section")
    }
    else if(path === '/api'){
        
        //__dirname variables gives absolute path not relative. So it's safe instead of .
        const data = fs.readFile(`${__dirname}/Data/data.json`,'utf-8',(err,data)=>{
            const productData = JSON.parse(data);

            writeHead(200,{
                'Content-Type':'application/json'
            })
            console.log(productData);
            res.end(data);
        });

        

       
        
        

        

    }
    else{
        res.writeHead(404 , {
            'Content-Type':'text/html',
            'My-Custom-Header':'wrong url'

        })
        res.end("NOT FOUND")
    }

})

// listening server.listen(port,ip,callback)

const IP = '127.0.0.1';
const PORT = 8000;

server.listen(PORT,IP, ()=>{

    console.log(`Server started listening on port : ${PORT}\n\n`)
})