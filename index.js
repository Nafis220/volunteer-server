const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors')
const app = express()
app.use(bodyParser.json())
app.use(cors())
const port = 8080
const ObjectId = require('mongodb').ObjectId 
require('dotenv').config()



const MongoClient = require('mongodb').MongoClient;
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.hybz5.mongodb.net/volunteer-collection?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
client.connect(err => {
  const eventCollection = client.db("volunteer-collection").collection("volunteers-info");
  const volunteerPersonalInfo = client.db("volunteer-collection").collection("volunteerPersonalInfo");
  const newEvents = client.db("volunteer-collection").collection("newEvents");
  app.post('/addEvents',(req, res) => {
    const event = req.body ; 
    console.log(event)
    eventCollection.insertOne(event)
    .then(result => {
      console.log(result)
    })
  })

 
  app.get('/eventsCollection', (req, res)=>{
    eventCollection.find({})
    .toArray((err,documents)=>{
   res.send(documents)
    })
  })

  app.post('/newEvent',(req, res)=>{
    const info = req.body
    console.log(info)
    newEvents.insertOne(info)
    .then(result=>{
     res.send( result.insertedCount > 0 )
    })
    
  })
  app.post('/volunteerPersonalInfo',(req, res)=>{
    const info = req.body
    
    volunteerPersonalInfo.insertOne(info)
    .then(result=>{
     res.send( result.insertedCount > 0 )
    })
    
  })

  app.get('/volunteerEvents',(req, res)=>{
    volunteerPersonalInfo.find({email : req.query.email})
    .toArray((err,document)=>{
      res.send(document)
    })
  })

  app.get('/volunteerAllEvents',(req, res)=>{
    volunteerPersonalInfo.find()
    .toArray((err,document)=>{
      res.send(document)
    })
  })

  app.get('/newEvents',(req, res)=>{
    newEvents.find()
    .toArray((err,document)=>{
      res.send(document)
    })
  })


  app.delete('/delete/:id',(req, res)=>{
   
    volunteerPersonalInfo.deleteOne({_id : ObjectId(req.params.id)})
    .then( document =>{
      res.send(document.deletedCount > 0)
    })
  })

  app.delete('/deleteMember/:email',(req, res)=>{
   console.log(req.params.email)
    volunteerPersonalInfo.deleteOne({email : req.params.email})
    .then( document =>{
      res.send(document.deletedCount > 0)
    })
  })
});





app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.listen(port)
