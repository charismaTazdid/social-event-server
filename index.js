const express = require('express')
const { MongoClient, ServerApiVersion } = require('mongodb');
const ObjectId = require('mongodb').ObjectId;
const cors = require('cors')
const bodyParser = require('body-parser');
const res = require('express/lib/response');
require('dotenv').config();
const port = process.env.PORT || 5050;

const app = express()
app.use(bodyParser.json())
app.use(cors())

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.vyi6c.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;



const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });
client.connect(err => {
  const eventCollection = client.db(`${process.env.DB_NAME}`).collection("events");
  const registerEventCollection = client.db(`${process.env.DB_NAME}`).collection("registerEvent");

  //post or add a new event by admin
  app.post('/addNewEvent', (req, res) => {
    const eventData = req.body;
    eventCollection.insertOne(eventData)
      .then(result => {
        console.log(result)
      })
  });

  //get all existing event
  app.get('/getEvents', (req, res) => {
    eventCollection.find({})
      .toArray((err, documents) => {
        res.send(documents)
      })
  });

  //get detial about purticuler event for details by id
  app.get('/getSingleEvent/:eventId', (req, res) => {
    const id = ObjectId(req.params.eventId)
    eventCollection.find({ _id: id })
      .toArray((err, documents) => {
        // console.log(documents)
        res.send(documents)
      })
  });

  //post or booking an event by user
  app.post('/registerEvent', (req, res) => {
    const event = req.body;
    registerEventCollection.insertOne(event)
      .then(result => {
        console.log(result)

      })
  });


  //get rigister event for specific user with email
  app.get('/getRegisterEvent', (req, res) => {
    registerEventCollection.find({ volunteerEmail: req.query.email })
      .toArray((err, documents) => {
        res.send(documents)
      })
  });

  //Delete an event by user form his/her rigister collection
  app.delete('/deleteMyEvent/:id', (req, res) => {
    registerEventCollection.deleteOne({ _id: ObjectId(req.params.id) })
      .then(result => {
        res.send(result.deletedCount > 0)
        console.log('1 item deleted')
      })
  });

  //get all reigisterd event and volunteer for admin
  app.get('/getAllRegisterEvent', (req, res) => {
    registerEventCollection.find({})
      .toArray((err, documents) => {
        res.send(documents)
      })
  });


  app.delete('/deleteEvent/:id', (req, res) => {
      eventCollection.deleteOne({_id: ObjectId(req.params.id)})
      .then(result => {
        res.send(result.deletedCount > 0)
        console.log('1 item deleted successfully')
      })
  })




});











app.get('/', (req, res) => {
  res.send('Hello World!')
})
app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})