const express = require('express')
const path = require('path')
const fs = require('node:fs')
const port = 3000
const MongoClient = require('mongodb').MongoClient
const env = require('dotenv').config()
const mongodb = require('mongodb')
const connectToMongo = require('./db')

const app = express()
app.use(express.static(path.join(__dirname,'public')))
app.use(express.json())
app.use(express.urlencoded({extended: false}))
//Ryan helped me with sending blobs to server
const bodyParser = require('body-parser')
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended: false}))


connectToMongo()

//learned about gridfs through here:https://www.mongodb.com/docs/drivers/node/current/crud/gridfs/
MongoClient.connect(process.env.mongoURI)
    .then(client => {
        console.log('Connected to Vanilla MongoDB')
        const db =client.db('Buckets')
        
        require('./file_creator.js')(app,db,mongodb,fs)
    }) 




app.listen(port, () =>{
    console.log(`Server running on http://localhost:${port}`)
})