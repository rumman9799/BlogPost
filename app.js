require('dotenv').config()
const express = require('express')
const mongoose = require('mongoose')
const config = require('config')
const chalk = require('chalk')

const setMiddleware = require('./middleware/middleware')
const setRoutes = require('./routes/routes')


const MONGODB_URI = `mongodb+srv://rumman:QYKGh14MJDRUcRIK@cluster0.e1ywht2.mongodb.net/?retryWrites=true&w=majority`


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
mongoose.connect(MONGODB_URI, {
        useNewUrlParser: true,
        useUnifiedTopology: true
    })
    .then(() => {
        console.log(chalk.green('Database Connected'))
        app.listen(PORT, () => {
            console.log(chalk.green.inverse(`Server is running on PORT ${PORT}`))
        })
    })
    .catch(e => {
        return console.log(e)
    })
