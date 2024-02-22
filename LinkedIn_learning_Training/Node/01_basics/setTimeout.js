const t = 3000;
console.log(`Setting timeout of ${t/1000} seconds`);

setTimeout(()=>{
    console.log('done');
},t)