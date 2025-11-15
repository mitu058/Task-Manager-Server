const express = require('express');
const cors = require('cors');
const port = process.env.PORT || 5000;
const app = express();

app.use(cors());
app.use(express.json());

const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');

const uri = "mongodb+srv://TaskManager:KKKGcbRJF4iNsO6o@cluster0.nbnyaol.mongodb.net/?appName=Cluster0";

const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {
    await client.connect();

    const userCollection = client.db("userDB").collection("newUsers");
    const taskCollection = client.db("taskDB").collection("allTasks");

    // Register user
    app.post('/user', async (req, res) => {
      const user = req.body;
      const result = await userCollection.insertOne(user);
      res.send(result);
    });

    // Get all users
    app.get('/users', async (req, res) => {
      const users = await userCollection.find().toArray();
      res.send(users);
    });

    // Add task
    app.post('/tasks', async (req, res) => {
      const task = req.body;
      const result = await taskCollection.insertOne(task);
      res.send(result);
    });

    // Get all tasks
    app.get('/tasks', async (req, res) => {
      const tasks = await taskCollection.find().toArray();
      res.send(tasks);
    });

    // Get tasks by user email
    app.get('/tasks/:email', async (req, res) => {
      const email = req.params.email;
      const tasks = await taskCollection.find({ userEmail: email }).toArray();
      res.send(tasks);
    });

    // Delete task
    app.delete('/tasks/:id', async (req, res) => {
      const id = req.params.id;
      const result = await taskCollection.deleteOne({ _id: new ObjectId(id) });
      res.send(result);
    });

    app.put('/update-task/:id', async(req, res)=>{
      const id = req.params.id;
      const {title, description, status} = req.body
      const query = {_id: new ObjectId(id)}
      const update = {
        $set: {
          title, description, status
        }
      }
      const result = await taskCollection.updateOne(query, update)
      res.send(result)
    })

    console.log("Connected to MongoDB!");
  } finally {
  }
}
run().catch(console.dir);

// Only one home route
app.get('/', (req, res) => {
  res.send('Task Manager Server Running');
});

app.listen(port, () => {
  console.log(`Server running on port: ${port}`);
});
