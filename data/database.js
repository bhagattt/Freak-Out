require('dotenv').config();
const { MongoClient } = require('mongodb');

let database;

async function connect() {
  const uri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/blogs'; 
  try {
    const client = await MongoClient.connect(uri, {
      useUnifiedTopology: true
    });
    database = client.db(); 
    console.log('Database connection established');
  } catch (error) {
    console.error('Failed to connect to the database', error);
    throw error; 
  }
}

function getDb() {
  if (!database) {
    throw new Error('Database connection not established');
  }
  return database;
}

module.exports = {
  connectToDatabase: connect,
  getDb: getDb
};
