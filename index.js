const express = require('express')
const cors = require('cors')
require('dotenv').config()


const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const app = express()
const port = process.env.PORT || 3000

app.use(cors())
app.use(express.json());



const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.qxvdmah.mongodb.net/?appName=Cluster0`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();

    const gardenCollection = client.db('GardeningDB').collection('gardens')
    const user=client.db('GardeningDB').collection('user')
    
     //gardeningDatabase 
    app.get('/gardens', async (req, res) => {
      const result = await gardenCollection.find().toArray()
      res.send(result)
    })
   //update information
    app.get('/gardens/:id',async(req,res)=>{
      const id=req.params.id;
      const query={_id:new ObjectId(id)}
      const result=await gardenCollection.findOne(query)
      res.send(result)
    })
   
    app.post('/gardens', async (req, res) => {
      const newtips = req.body;
      const result = await gardenCollection.insertOne(newtips)
      res.send(result)

    })
     //delete db
    app.delete('/gardens/:id',async(req,res)=>{
      const id=req.params.id;
      const query={_id:new ObjectId(id)}
      const result=await gardenCollection.deleteOne(query)
      res.send(result)
    })

    //update db
    app.put('/gardens/:id',async(req,res)=>{
      const id=req.params.id;
      const filter={_id:new ObjectId(id)}
      const options={upsert:true}
      const updatetips=req.body
      const updateDoc={
        $set:updatetips
      }
      const result=await gardenCollection.updateOne(filter,updateDoc,options)
      res.send(result)
    })

    //user DB
    app.get('/user',async(req,res)=>{
      const result=await user.find().toArray()
      res.send(result)
    })

    app.post('/user',async(req,res)=>{
      const newuser=req.body;
      const result=await user.insertOne(newuser)
      res.send(result)
    })


    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);


app.get('/', async (req, res) => {
  res.send('gardening server are runing')
});

app.listen(port, () => {
  console.log(`Gardening server is running on port ${port}`);
})