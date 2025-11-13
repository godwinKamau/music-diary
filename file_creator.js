const path = require('path')
const passport = require('passport')
const multer = require('multer')
const { ObjectId } = require('mongodb')

//needed this stack overflow answer to fix the path file
//also used this to understand multer: https://expressjs.com/en/resources/middleware/multer.html
//multer middleware functions found with the help of Ryan Hernandez.    
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname,'./uploads')); // Specify the destination folder for uploaded files
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname); // Define the filename
  }
});

const upload = multer({ storage: storage });


module.exports = function(app,db,mongodb,fs,User) {

    app.get('/', (req,res) => {
        res.sendFile('index.html')
    })

    const bucket = new mongodb.GridFSBucket(db, { bucketName: 'myCustomBucket' });

//type is used as a --middleware-- in this post request in the midst of passing the request.
    app.post('/makefile', upload.single('audio'), (req,res) => {
        const name = req.file.filename.split('.')[0]
        console.log(req.file.path)
//quick refresher on async/await: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/async_function
//Also, writing and deleting files: https://nodejs.org/en/learn/manipulating-files/writing-files-with-nodejs
        const workSchedule = async(req) => {
            await fs.createReadStream(req.file.path).
            pipe(bucket.openUploadStream(req.file.filename, {
                chunkSizeBytes: 1048576,
                metadata: { name , author:req.user.username, time:Date.now() }
            }))
            console.log('Added to database.')
            fs.unlink(`${req.file.path}`, (err) => {
                if (err) throw err
                console.log('Deleted file!')
            })
        }
        workSchedule(req)
        
        res.send('Audio Saved!')
    })

    app.get('/audioFromUser', async (req,res) => {
        let tracker = 0
        let response = {}
        console.log('user',req.user.username)
        const cursor = bucket.find({ 'metadata.author': `${req.user.username}` })
        for await (const doc of cursor){
            tracker++
            // console.log('document details',doc)
            response[tracker] = doc
        }
        // console.log(response)
        // res.json(response)
        res.render(('profile'), { user : req.user.username,
            response : response
         })
    
    })

    app.get('/singularAudio/:id', async(req,res) =>{
        const id = req.params.id
        let object
        const files = bucket.find({ _id : new ObjectId(`${id}`) })
        for await (const file of files){
            
            // object = await bucket.openDownloadStream(new ObjectId(`${id}`)).
            //     pipe(fs.createWriteStream(path.join(__dirname,`./finds/${file.metadata.name}`)));

//Michael Kazin: You don't have to save intermediate products. That's the point of the friggin' pipe/stream! 
            object = await bucket.openDownloadStream(new ObjectId(`${id}`)).
                pipe(res);

            // res.redirect(`/sendFile?path=${object.path}`)
        }
//how to pass query parameters into redirect url(not uri): https://stackoverflow.com/questions/19035373/how-do-i-redirect-in-expressjs-while-passing-some-context
        
    })


}