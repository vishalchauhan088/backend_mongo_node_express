const process = require('process');

const question = [
    'what\'s your name ?',
    'what will you do in evening? ',
    'will you go out with me? '
]
const answer = [

]

function ask(i){
    console.log(`${question[i]}`);
    console.log('>');
}

process.stdin.on("data", (data)=>{  //working async
    answer.push(data.toString().trim());
    if(answer.length < question.length){
        ask(answer.length)
    }
    else{
        
        
        process.exit();
    }
})

ask(answer.length);



process.on('exit',(code)=>{
    process.stdout.write("\n\n\n\n");
    process.stdout.write(answer.toString());
   
})