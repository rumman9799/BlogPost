require('dotenv').config()
const express = require('express')
const mongoose = require('mongoose')
const config = require('config')
const chalk = require('chalk')

const setMiddleware = require('./middleware/middleware')
const setRoutes = require('./routes/routes')
const { MongoClient, ServerApiVersion } = require('mongodb');

//const MONGODB_URI = `mongodb+srv://rumman:QYKGh14MJDRUcRIK@cluster0.e1ywht2.mongodb.net/`
const uri = "mongodb+srv://rumman:QYKGh14MJDRUcRIK@cluster0.e1ywht2.mongodb.net/?retryWrites=true&w=majority";

const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

const app = express()

// Setup View Engine
app.set('view engine', 'ejs')
app.set('views', 'views')

// Using Middleware from Middleware Directory
setMiddleware(app)

// Using Routes from Route Directory
setRoutes(app)

app.use((req, res, next) => {
    let error = new Error('404 Page Not Found')
    error.status = 404
    next(error)
})

app.use((error, req, res, next) => {
    if (error.status === 404) {
        return res.render('pages/error/404', { flashMessage: {} })
    } 
    console.log(chalk.red.inverse(error.message))
    console.log(error)
    res.render('pages/error/500', { flashMessage: {}})
})

const PORT = process.env.PORT || 8080
// mongoose.connect(MONGODB_URI, {
//         useNewUrlParser: true,
//         useUnifiedTopology: true
//     })
//     .then(() => {
//         console.log(chalk.green('Database Connected'))
//         app.listen(PORT, () => {
//             console.log(chalk.green.inverse(`Server is running on PORT ${PORT}`))
//         })
//     })
//     .catch(e => {
//         return console.log(e)
//     })


async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();
    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    await client.close();
  }
}
run().catch(console.dir);
