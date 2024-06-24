require('dotenv').config();
const {MongoClient, ClientSession} = require('mongodb');
console.log(process.env.URI);
const uri = process.env.URI;

const client = new MongoClient(uri);
const dbname = 'sample_airbnb';

const connectToDatabase = async () =>{
    try{
        await client.connect();
        console.log(`Connected to database :${dbname}`);

        const databaseList = await client.db().admin().listDatabases();

        //console.log(databaseList);

        databaseList.databases.forEach(db => console.log(`${db.name}`));


    }
    catch(err){
        console.log(`'Errror connecting to the database ${err}`);
    }
};

const connectToDb = async (dbname) =>{
    try{
        const database = client.db(dbname)
        console.log(`connected to datbase ${dbname}`);
        return database;
    }
    catch(err){
        console.log(`error while connecting to database ${dbname}`);
    }
    

}

const connectToCollection = async (database) =>{
    try{
        const collection = await database.collection('listingsAndReviews');
        const data = await collection.find({}).limit(5).toArray();
        
        return data;
    }
    catch(err){
        console.log(`error in fetching the data: ${err}`);
    }
}

const main = async () =>{
    try{
        await connectToDatabase();
        const database = await connectToDb(dbname);
        const result = await connectToCollection(database);
        console.log('retrieved data is :');
        //console.log(result);
        result.forEach(document => console.log(document.name));
    }
    catch(err){
        console.log(`error connecting to database :${err}`);
    }
    finally{
        await client.close();
    }
}

main();
