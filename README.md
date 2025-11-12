# Music Diary

A place to learn music by finding a good song and recording yourself trying it out. 

_Warning: Incomplete. It's messy, the HTML/CSS is tirefire garbage, but [it's mine](https://www.youtube.com/watch?v=T82OEZmCr1o) and I'm proud of it._

<hr>

<img src="./Screenshot 2025-11-10 at 12.13.45 PM.png">

<hr>

## Major Sources: 

Basic commands for GridFS: https://www.mongodb.com/docs/drivers/node/current/crud/gridfs/

Understanding MediaPlayer and Blobs: https://developer.mozilla.org/en-US/docs/Web/API/MediaStream_Recording_API/Using_the_MediaStream_Recording_API

<hr>

## Tech Stack

| Category  | Tools                               |
| --------- | ----------------------------------- |
| Backend   | Node.js, Express, Mongoose, MongoDB, GridFS, Multer |
| Frontend  | EJS, HTML, CSS, JavaScript          |
| Dev Tools | Nodemon, dotenv                     |

<hr>

## Live Demo

https://music-diary-e0xi.onrender.com

<hr>

## (For Developers)

### Installation & Setup

Make sure you have Node.js and MongoDB (or MongoDB Atlas) set up.

```
git clone <your-repo-url>
cd <project-folder>
npm install
```



### Environment Variables

Create a .env file:

```
MONGODB_URL=your_mongo_connection_string
```

### Run the App

```
npm run dev
```

This runs the server using nodemon for automatic reload during development.

<hr>

## Features

- Recording and storing audio files for audiophiles.
- Full-stack Express + EJS templating
- Passport Strategies to hold user authentication and sessions

<hr>

## Future Improvements

- Add a YouTube iframe to pair with the audio files so users can listen to their recording and the musical inspiration side-by-side.
- Major CSS updates to give it pizzazz.
- Reorganizing database and I/O functions to only call the files the user clicks on.
