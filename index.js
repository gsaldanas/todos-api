// app.js
import express from "express";
import { MongoClient } from "mongodb";
import cors from "cors";
import dotenv from "dotenv";
dotenv.config();

//variables
const app = express();
const port = process.env.PORT || 3000;
const uri = process.env.MONGO_REMOTE;
const dbName = "personal";
export default app;

// CORS
app.use(
    cors({
      origin: "http://localhost:5173",
    })
  );
  
//middleware (parser)
app.use(express.json());

//connect client
const client = new MongoClient(uri);

//connect to database
async function connectToDatabase() {
  try {
    await client.connect();
    console.log("Connected successfully to MongoDB");
  } catch (err) {
    console.error("Error connecting to MongoDB:", err);
    process.exit(1);
  }
}

//get route
//get all todos from the database
app.get("/", async (req, res) => {
  try {
    const db = client.db(dbName);
    const todosCollection = db.collection("todos");
    const todos = await todosCollection.find({}).toArray();
    res.json(todos);
  } catch (error) {
    console.error("Error fetching todos:", error);
    // res.status(500).json({ error: "Internal server error" });
  }
});

async function startServer() {
  await connectToDatabase();

  app.listen(port, () => {
    console.log(`Example app listening on port 🚀${port}`);
  });
}

startServer();
