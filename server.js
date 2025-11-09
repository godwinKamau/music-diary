const express = require('express')
const session = require('express-session')
const passport = require('passport')
const localStrategy = require('passport-local').Strategy
const MongoStore = require('connect-mongo')
const path = require('path')
const fs = require('node:fs')
const port = 3000
const MongoClient = require('mongodb').MongoClient
const env = require('dotenv').config()
const mongodb = require('mongodb')
const connectToMongo = require('./db')
const User = require('./User.js')

//====middleware
const app = express()
app.set('view engine','ejs')
app.set('views', path.join(__dirname, 'views'));
app.use(express.static(path.join(__dirname,'public')))
app.use(express.json())
app.use(express.urlencoded({extended: false}))


//Ryan helped me with sending blobs to server
const bodyParser = require('body-parser')
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended: false}))
//

connectToMongo()
app.use(session({
  secret: process.env.SECRET_KEY,
  resave: false,
  saveUninitialized: true,
  store: new MongoStore({ mongoUrl: process.env.mongoURI })
}));


//=====passport stuff
const strategy = new localStrategy(User.authenticate())
passport.use(strategy);
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());
app.use(passport.initialize());
app.use(passport.session());

require('./passports.js')(app,User,passport)

//learned about gridfs through here: https://www.mongodb.com/docs/drivers/node/current/crud/gridfs/
MongoClient.connect(process.env.mongoURI)
    .then(client => {
        console.log('Connected to Vanilla MongoDB')
        const db =client.db('Buckets')
        
        require('./file_creator.js')(app,db,mongodb,fs)
    })

app.listen(port, () =>{
    console.log(`Server running on http://localhost:${port}`)
})