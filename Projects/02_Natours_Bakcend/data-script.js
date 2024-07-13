const fs = require('fs');
const Tour = require("./Models/tourModel");
const { json } = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv').config();


async function createConnection(){
    try{
        console.log("starting connection with database !!");
        const uri = process.env.DATABASE_URI.replace('<password>',process.env.DATABASE_PASSWORD);
        //console.log(uri);
        // console.log(uri);
        await mongoose.connect(uri)
        console.log("Database Connection Successful");
    }
    catch(err){
        console.log("Error while connecting to database");
    }

}

//create connection


 async function importData(){
    
    try{
        let data = fs.readFileSync(`${__dirname}/data/tours.json`);
        data = JSON.parse(data);
        await Tour.create(data);
        //console.log(data);
        //const newTour = Tour.create(data);
        console.log("data inserted in mongodb database");
        
        
        process.exit();
    }
    catch(error){
        console.log(error)
    }
}

async function deleteData(){
    try{
      
        await Tour.deleteMany({});
        console.log("All data deleted from mongodb");
        process.exit();
    }
    catch(error){
        console.log(err.message);
    }
}


async function main(){
        await createConnection();
                
        if( process.argv[2] === '--delete'){
            await deleteData();
            console.log("All data deleted from mongodb");
        }
        else if(process.argv[2] === '--import'){
            await importData();
            console.log("data imported to mongoDB");
        }
        else {
            console.log('Invalid argument. Use --import to import data or --delete to delete data.');
            process.exit(1); // Exit process with failure
        }
    
}
main();
