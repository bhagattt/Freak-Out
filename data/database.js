const mongodb = require('mongodb');
const MongoClient = mongodb.MongoClient;

let database;

async function connect() {
  try {
    const client = await MongoClient.connect('mongodb://127.0.0.1:27017', {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
    database = client.db('blogs');
    console.log('Database connection established');
  } catch (error) {
    console.error('Failed to connect to the database', error);
    throw error; // Propagate the error so it can be handled upstream
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
