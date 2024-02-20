// importing http module

const http = require('http');

// creating server

const server = http.createServer((req,res) =>{

    console.log(req);
    
    res.write("Hello client");
    res.end();
})

//.listen(port,ip,[optional callback]) : callback is called when server actually start listening:

 const PORT = 8000;
 const IP = '127.0.0.1';

server.listen(PORT,IP,()=>{
    console.log(`Server Listening on Port:${PORT} on address ${IP}`)
});