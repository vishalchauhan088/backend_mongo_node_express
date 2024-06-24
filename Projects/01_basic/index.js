import express from 'express';

const app = express();

const PORT = 5000;

app.get('/', (req,res)=>{
    res.send('home route')
})

app.get('/contact', (req,res)=>{
    res.send('contact route');
})

app.get('/about',(req,res)=>{
    res.status(200).json({'name':"vishal chauhan"});
})

app.get('/*',(req,res)=>{
    res.status(404).send('not found');
})

app.post("/",(req,res)=>{
    res.send('you can not post to this endpoitn');
})


app.listen(PORT,()=>{
    console.log(`listenning at port ${PORT}`);
})