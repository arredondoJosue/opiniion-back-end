const { MongoClient, ServerApiVersion } = require("mongodb");

const client = new MongoClient(process.env.MONGODB_URI, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function connectToDatabase() {
  try {
    // Connect the client to the server (optional starting in v4.7)
    await client.connect();
    // Send a ping to confirm a successful connection
    await client.db("opiniion").command({ ping: 1 });
    console.log("Connected successfully to MongoDB in dbConnect.js");

    // Return the database object
    return client.db("opiniion");
  } catch (error) {
    console.error("Failed to connect to MongoDB", error);
    throw error;
  }
}

module.exports = connectToDatabase;
