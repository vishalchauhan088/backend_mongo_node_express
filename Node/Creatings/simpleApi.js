const http = require('http');


// creating server

const server = http.createServer((req, res) =>{

    // console.log(req.url);

    const pathName = req.url;

    //routing 

    if(pathName === '/' || pathName === '/overview'){
        res.end("This is overview");
    }
    else if(pathName === '/product'){
        res.end("This is product");
    }
    else if(pathName === '/contact'){
        res.end("Please contact us at: asdfas;dflk");
    }
    else{
        res.writeHead(404, {

            'Content-Type':'text/html',
            'My-Own-Header':'hello world'
            
        }) //writing status,http headers  || this will not appear on res page;
        res.end("<h1>PAGE NOT FOUND </h1>");
    }

    
   
})

//listing 
const PORT = 8000;
const IP = '127.0.0.1'

server.listen(PORT,IP,() =>{
    console.log(`Server is listening on port :${PORT} at ip : ${IP}`);
})