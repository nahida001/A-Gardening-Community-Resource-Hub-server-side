const express = require('express');
const cors = require('cors');
require('dotenv').config();
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.qxvdmah.mongodb.net/?appName=Cluster0`;

const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

let clientPromise;

async function getDb() {
  if (!clientPromise) {
    clientPromise = client.connect();
  }
  await clientPromise;
  return client.db('GardeningDB');
}

app.get('/', (req, res) => {
  res.send('gardening server is running');
});

// gardens
app.get('/gardens', async (req, res) => {
  const db = await getDb();
  const gardenCollection = db.collection('gardens');
  const result = await gardenCollection.find().toArray();
  res.send(result);
});

app.get('/gardens/:id', async (req, res) => {
  const db = await getDb();
  const gardenCollection = db.collection('gardens');
  const id = req.params.id;
  const query = { _id: new ObjectId(id) };
  const result = await gardenCollection.findOne(query);
  res.send(result);
});

app.post('/gardens', async (req, res) => {
  const db = await getDb();
  const gardenCollection = db.collection('gardens');
  const newtips = req.body;
  const result = await gardenCollection.insertOne(newtips);
  res.send(result);
});

app.delete('/gardens/:id', async (req, res) => {
  const db = await getDb();
  const gardenCollection = db.collection('gardens');
  const id = req.params.id;
  const query = { _id: new ObjectId(id) };
  const result = await gardenCollection.deleteOne(query);
  res.send(result);
});

app.put('/gardens/:id', async (req, res) => {
  const db = await getDb();
  const gardenCollection = db.collection('gardens');
  const id = req.params.id;
  const filter = { _id: new ObjectId(id) };
  const updatetips = req.body;
  const updateDoc = { $set: updatetips };
  const result = await gardenCollection.updateOne(filter, updateDoc, { upsert: true });
  res.send(result);
});

// users
app.get('/user', async (req, res) => {
  const db = await getDb();
  const userCollection = db.collection('user');
  const result = await userCollection.find().toArray();
  res.send(result);
});

app.post('/user', async (req, res) => {
  const db = await getDb();
  const userCollection = db.collection('user');
  const newuser = req.body;
  const result = await userCollection.insertOne(newuser);
  res.send(result);
});

app.patch('/user', async (req, res) => {
  const db = await getDb();
  const userCollection = db.collection('user');
  const { email, lastSignInTime } = req.body;

  const filter = { email };
  const updateDoc = {
    $set: { lastSignInTime },
  };

  const result = await userCollection.updateOne(filter, updateDoc);
  res.send(result);
});

app.delete(['/user/:id', '/users/:id'], async (req, res) => {
  const db = await getDb();
  const userCollection = db.collection('user');
  const id = req.params.id;
  const query = { _id: new ObjectId(id) };
  const result = await userCollection.deleteOne(query);
  res.send(result);
});

if (require.main === module) {
  app.listen(port, () => {
    console.log(`Gardening server is running on port ${port}`);
  });
}

module.exports = app;