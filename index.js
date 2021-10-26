const express = require('express')
const { MongoClient } = require('mongodb');
const ObjectId = require('mongodb').ObjectId;
const cors = require('cors')
require('dotenv').config()



const app = express()
const port = process.env.PORT || 5000;


// mideleware 

app.use(cors());
app.use(express.json())

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.fq8sq.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

async function run() {
    try {
        await client.connect();
        const database = client.db("car-mechanic");
        const serviceCollection = database.collection("service");

        // Load services
        app.get('/services', async (req, res) => {

            const cursor = serviceCollection.find({});
            const services = await cursor.toArray()
            res.send(services)

        })

        // get post api 
        app.get('/services/:id', async (req, res) => {

            const id = req.params.id;
            const quarry = { _id: ObjectId(id) }
            const result = await serviceCollection.findOne(quarry)
            res.json(result)


        })

        app.delete('/services/:id', async (req, res) => {
            const id = req.params.id;
            const quarry = { _id: ObjectId(id) }
            const result = await serviceCollection.deleteOne(quarry)
            res.json(result)
        })


        app.post('/services', async (req, res) => {
            const service = req.body;
            console.log('hit the post api', service);
            const result = await serviceCollection.insertOne(service);
            console.log(result);
            res.json(result)

        })
    } finally {
        // await client.close();
    }
}
run().catch(console.dir);

app.get('/', (req, res) => {
    res.send('Hello express js running genius port  !')
})

app.listen(port, () => {
    console.log('running genius port ')
})