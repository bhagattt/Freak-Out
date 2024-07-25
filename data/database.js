require('dotenv').config();
const { MongoClient } = require('mongodb');

let database;

async function connect() {
  const uri = process.env.MONGODB_URI;
  if (!uri) {
    throw new Error('MONGODB_URI environment variable is not set');
  }

  try {
    const client = await MongoClient.connect(uri, {
      useNewUrlParser: true,
      useUnifiedTopology: true // Ensures compatibility with the latest MongoDB features
    });
    database = client.db();
    console.log('Database connection established');
  } catch (error) {
    console.error('Failed to connect to the database', error.message);
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
