const { clearInterval } = require("timers");

let currTime = 0;
let waitTime = 5000;
let intervalTime = 500;

setTimeout(()=>{
    clearInterval(interval);
    
    console.log("\x1b[32m"+"\ninstalled successfully " + "\x1b[0m")
},waitTime)

const interval = setInterval(()=>{
    currTime += intervalTime;
    const p = Math.floor((currTime/waitTime) *100 );
    process.stdout.clearLine();
    process.stdout.cursorTo(0);
    process.stdout.write(`waiting... ${p} %`);
},500)

