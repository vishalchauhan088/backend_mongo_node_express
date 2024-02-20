const fs = require('fs');
const http = require('http');
// problem with prev version: Every time someone goes to that route -> file is read
// solution: read file async:
// code above creating server is called once only

const data = fs.readFileSync(`${__dirname}/Data/data.json` , 'utf-8');

productObj = JSON.parse(data);


const server = http.createServer((req, res) =>{
    const path = req.url;

    if(path === '/' || path === '/overview'){
        res.end('Welcome to overview');
    }
    else if(path === '/api'){
        res.writeHead(200,{
            'Content-Type':'application/json'
            
        })
        res.end(data);
        console.log(productObj)
    }
    else{
        res.writeHead(404,{
            'Content-type':'text/html',
            'Message':`PATH NOT FOUND :${path}`
        })
        res.end('PATH NOT FOUND');
    }
})

// listening server.listen(port,ip,callback)
const PORT = 8000
const IP = '127.0.0.1'

server.listen(PORT,IP, () =>{
    console.log(`Server started at : ${PORT}`);
})