const express = require("express");
const cors = require("cors");
const {MongoClient, ServerApiVersion, ObjectId} = require("mongodb");
require("dotenv").config();
const app = express();
const port = process.env.PORT || 5000;

// middleware
app.use(cors());
app.use(express.json());

console.log(process.env.DB_USER);

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster01.rrfocni.mongodb.net/?retryWrites=true&w=majority&appName=Cluster01`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();
    // Send a ping to confirm a successful connection
   
    const servecCollection = client.db('carDB').collection('services');
    const bookingCollection = client.db('carDB').collection('bookings')
 

    app.get('/serveces', async(req,res)=>{
        const cursor = servecCollection.find()
        const result = await cursor.toArray();
        res.send(result)
    })
    
    app.get('/serveces/:id', async(req,res)=>{
        const id = req.params.id;
        const query = {_id: new ObjectId(id)};
        const options = {
          // Include only the `title` and `imdb` fields in the returned document
          projection: {title: 1, price: 1, service_id: 1, img:1},
        };
        const result =await servecCollection.findOne(query, options)
         
        res.send(result)
    });


    // booking API's
     
    app.get('/bookings', async(req,res)=>{
       
       let quary = {}
       if(req.query?.email){
          quary = {email:req.query.email}
       }
       const result = await bookingCollection.find(quary).toArray();
       res.send(result)
    })



    app.post('/bookings', async(req,res)=>{
      const booking = req.body;
      console.log(booking);
      const result = await bookingCollection.insertOne(booking);
      res.send(result)
    })

    app.delete('/bookings/:id', async(req,res)=>{
       const id = req.params.id;
       const quary = {_id: new ObjectId(id)};
       const result = await bookingCollection.deleteOne(quary);
       res.send(result)
    })



    app.patch('/bookings/:id', async(req,res)=>{
      const id = req.params.id
      const filter= {_id : new ObjectId(id)};
      const quary = req.body;
       console.log(quary);
       const updateDoc = {
         $set: {
           stutas: quary.stutas,
         },
       };
      
      const result = await bookingCollection.updateOne(filter,updateDoc)
      res.send(result)
    })




    await client.db("admin").command({ping: 1});
    console.log(
      "Pinged your deployment. You successfully connected to MongoDB!"
    );
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("Car is Running");
});

app.listen(port, () => {
  console.log("Car is running");
});
