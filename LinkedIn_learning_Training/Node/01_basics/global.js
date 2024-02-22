// IN brower global object is called window
// In node global object is called global
//global is available to use < without importing anything >

console.log('writing without using global object name');
global.console.log('Writing  by global');

//variables are not globally available
let hello = "vishal chauhan";
console.log(global.hello); // this will print undefined


// making a variable belong to gloabl object **Not Recommended**
global.hii = "hii is inside global object now";
console.log(global['hii']+" "+global.hii);


//what else we have in global object??
//console.log(global);
for(let key in global){
    console.log(key);
}


console.log(__dirname); // prints the absolute folder path </Node/01_Start>
console.log(__filename); // prints the absolute file path; < /Node/01_Start/global.js >
