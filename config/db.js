const { MongoClient } = require("mongodb");
const uri = process.env.MONGODB_URI;
const client = new MongoClient(uri);

async function connectToDB(app) {
    await client.connect();
    console.log("Connected to MongoDB");
    const db = client.db("lab5");
    app.db = db;
}

module.exports = { connectToDB };
