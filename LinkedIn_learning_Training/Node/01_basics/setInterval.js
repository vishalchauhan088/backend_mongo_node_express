const { clearInterval } = require("timers");

let t = 0;

setTimeout(() => {
    clearInterval(interval);
}, 5000);


const interval = setInterval(()=>{
    console.log(`waiting time is : ${t/1000}` );
    t = t+500;
},500);